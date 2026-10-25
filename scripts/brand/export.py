#!/usr/bin/env python3
"""Render a loop from the approved native SVG, then encode GIF with FFmpeg.

Requires Python 3, rsvg-convert, ffmpeg, and gifsicle. No Python packages.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET
import zipfile


ROOT = Path(__file__).resolve().parent
NAVY = "#142C52"
AMBER = "#E6A83D"
AMBER_HOT = "#F6D08C"
PAPER = "#F8F7F3"
WHITE = "#FFFFFF"
FPS = 25
DURATION = 3.2
FRAMES = round(DURATION * FPS)

# Kernel brightness at rest, as a fraction of the full amber fill.
CORE_REST = 0.42
# Kernel: rise, full, decay starts, dark again.
CORE_TIMES = (0.10, 0.62, 2.14, 2.84)
# Ignition flash layered on the kernel: rise, peak, hold, out.
FLASH_TIMES = (0.56, 0.68, 0.74, 1.02)
FLASH_PEAK = 0.46
# Each pin carries one pulse: it leaves the chip body, runs to the tip, and
# dissipates there. Nothing travels back, so there is no return stroke.
# (leaves body, reaches tip, holds lit, fully gone)
UPPER_LEFT = (0.70, 0.92, 1.04, 1.32)
UPPER_RIGHT = (0.78, 1.00, 1.12, 1.40)
LOWER_LEFT = (1.50, 1.72, 1.84, 2.12)
LOWER_RIGHT = (1.58, 1.80, 1.92, 2.20)

PIN_LENGTH = 100
PIN_HEIGHT = 85
# name, rect x, rect y, times, which side of the chip
PIN_BOXES = (
    ("upper-left", 112, 364, UPPER_LEFT, "l"),
    ("upper-right", 812, 364, UPPER_RIGHT, "r"),
    ("lower-left", 112, 526, LOWER_LEFT, "l"),
    ("lower-right", 812, 526, LOWER_RIGHT, "r"),
)

BODY, CORE = [e.attrib["d"] for e in ET.parse(
    ROOT / "source" / "aels-core-primary.svg").getroot()
    if e.tag.endswith("path")]


def smoothstep(value: float) -> float:
    value = min(1.0, max(0.0, value))
    return value * value * (3.0 - 2.0 * value)


def envelope(t: float, times: tuple[float, ...]) -> float:
    start, peak, release, end = times
    if t < start or t >= end:
        return 0.0
    if t < peak:
        return smoothstep((t - start) / (peak - start))
    if t <= release:
        return 1.0
    return 1.0 - smoothstep((t - release) / (end - release))


def pin_state(t: float, times: tuple[float, ...]) -> tuple[float, float, float]:
    """Return (near edge, far edge, opacity) in pin units, 0 at tip, 1 at body.

    The pulse starts at the body, sweeps to the tip, holds lit, then the body
    side lets go first so the light drains outward and dies at the tip.
    """
    start, tip, release, end = times
    if t <= start or t >= end:
        return 1.0, 1.0, 0.0
    if t < tip:
        grow = smoothstep((t - start) / (tip - start))
        return 1.0 - grow, 1.0, 1.0
    if t <= release:
        return 0.0, 1.0, 1.0
    out = 1.0 - smoothstep((t - release) / (end - release))
    return 0.0, out, min(1.0, out * 3.0)


def curve_core(t: float) -> dict[str, float]:
    return {"opacity": CORE_REST + (1.0 - CORE_REST) * envelope(t, CORE_TIMES)}


def curve_flash(t: float) -> dict[str, float]:
    return {"opacity": FLASH_PEAK * envelope(t, FLASH_TIMES)}


def curve_pin(times: tuple[float, ...], side: str):
    shift = 1.0 if side == "l" else -1.0

    def curve(t: float) -> dict[str, float]:
        near, far, alpha = pin_state(t, times)
        return {"dx": shift * PIN_LENGTH * near,
                "sx": far - near,
                "opacity": alpha}
    return curve


def simplify(points: list[tuple[float, float]], tolerance: float) -> list[float]:
    """Drop samples that linear interpolation already reproduces."""
    if len(points) < 3:
        return [t for t, _ in points]
    kept = [0]
    index = 0
    while index < len(points) - 1:
        best = index + 1
        for end in range(len(points) - 1, index, -1):
            t0, v0 = points[index]
            t1, v1 = points[end]
            span = t1 - t0
            fits = True
            for mid in range(index + 1, end):
                tm, vm = points[mid]
                guess = v0 if span == 0 else v0 + (v1 - v0) * (tm - t0) / span
                if abs(guess - vm) > tolerance:
                    fits = False
                    break
            if fits:
                best = end
                break
        kept.append(best)
        index = best
    return [points[i][0] for i in kept]


TOLERANCE = {"dx": 0.4, "sx": 0.003, "opacity": 0.003}


def declarations(values: dict[str, float]) -> str:
    cells = []
    if "dx" in values or "sx" in values:
        cells.append(f"transform:translateX({values.get('dx', 0.0):.3f}px)"
                     f"scaleX({values.get('sx', 1.0):.4f})")
    if "opacity" in values:
        cells.append(f"opacity:{values['opacity']:.4f}")
    return ";".join(cells)


def keyframes(name: str, curve) -> str:
    samples = [(i / FPS, curve(i / FPS)) for i in range(FRAMES)]
    samples.append((DURATION, curve(DURATION)))
    keys = list(samples[0][1])
    stops: set[float] = {0.0, DURATION}
    for key in keys:
        stops.update(simplify([(t, v[key]) for t, v in samples],
                              TOLERANCE.get(key, 0.003)))
    out = []
    for t in sorted(stops):
        out.append(f"{t / DURATION * 100:.4f}%{{{declarations(curve(t))}}}")
    return f"@keyframes {name}{{" + "".join(out) + "}"


_STYLE_CACHE: list[str] = []


def stylesheet() -> str:
    if _STYLE_CACHE:
        return _STYLE_CACHE[0]
    rules = [keyframes("core-pulse", curve_core), keyframes("core-flash", curve_flash)]
    for name, x, y, times, side in PIN_BOXES:
        rules.append(keyframes(f"pin-{name}", curve_pin(times, side)))
    rules.append(".pin{transform-box:fill-box;}")
    # Rotate about the pin tip: the pulse grows out of the body, then leaves
    # through the tip, so the origin sits at the far end for both sides.
    rules.append(".pin-l{transform-origin:0% 50%;}")
    rules.append(".pin-r{transform-origin:100% 50%;}")
    rules.append(f".core{{animation:core-pulse {DURATION}s linear infinite;}}")
    rules.append(f".flash{{animation:core-flash {DURATION}s linear infinite;}}")
    for name, x, y, times, side in PIN_BOXES:
        rules.append(f".pin-{name}{{animation:pin-{name} {DURATION}s linear infinite;}}")
    _STYLE_CACHE.append(
        f"<style>@media (prefers-reduced-motion: no-preference) {{{''.join(rules)}}}</style>")
    return _STYLE_CACHE[0]


def pin_markup(animated: bool) -> str:
    parts = []
    for name, x, y, times, side in PIN_BOXES:
        if animated:
            geometry = f'x="{x}" y="{y}" width="{PIN_LENGTH}" height="{PIN_HEIGHT}"'
            parts.append(f'<g class="pin pin-{side} pin-{name}" opacity="0">'
                         f'<rect {geometry}/></g>')
        else:
            parts.append(f'<g class="pin-{name}">'
                         f'<rect id="pin-{name}" x="{x}" y="{y}" '
                         f'width="0" height="{PIN_HEIGHT}"/></g>')
    return "\n  ".join(parts)


def scene(theme: str, t: float = 0.0, animated: bool = False,
          static: bool = False) -> str:
    background, foreground = (PAPER, NAVY) if theme == "light" else (NAVY, WHITE)
    if animated:
        # Attributes carry the static identity, which is what reduced-motion sees.
        # The stylesheet overrides them only when motion is welcome.
        core, flash, pins = 1.0, 0.0, [(0.0, 0.0)] * len(PIN_BOXES)
        style = stylesheet()
    elif static:
        core, flash, pins = 1.0, 0.0, [(0.0, 0.0)] * len(PIN_BOXES)
        style = ""
    else:
        core = curve_core(t)["opacity"]
        flash = curve_flash(t)["opacity"]
        pins = [pin_state(t, box[3]) for box in PIN_BOXES]
        style = ""

    pin_layer = pin_markup(animated)
    if not animated and not static:
        # Bake the pulse into the geometry so the rendered frame matches the CSS.
        for index, (name, x, y, times, side) in enumerate(PIN_BOXES):
            near, far, alpha = pins[index]
            length = PIN_LENGTH * (far - near)
            left = (x + PIN_LENGTH * near if side == "l"
                    else x + PIN_LENGTH * (1.0 - far))
            pin_layer = pin_layer.replace(
                f'<rect id="pin-{name}" x="{x}" y="{y}" width="0"',
                f'<rect id="pin-{name}" x="{left:.3f}" y="{y}" width="{length:.3f}"')
            pin_layer = pin_layer.replace(
                f'<g class="pin-{name}">',
                f'<g class="pin-{name}" opacity="{alpha:.6f}">')

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"
    viewBox="0 0 1024 1024" role="img" aria-labelledby="title desc">
<title id="title">AELS CORE — kernel and pin signal loop</title>
<desc id="desc">The amber kernel ignites with a brief flash, then the four pins carry a pulse
out to their tips, upper pair first and lower pair second. Each pulse leaves the
body and fades at the tip instead of returning. The chip silhouette stays still.
The loop lasts {DURATION:g} seconds.</desc>
{style}
<defs><clipPath id="chip"><path d="{BODY}" clip-rule="evenodd"/></clipPath></defs>
<rect width="1024" height="1024" fill="{background}"/>
<path fill="{foreground}" fill-rule="evenodd" d="{BODY}"/>
<path class="core" fill="{AMBER}" opacity="{core:.6f}" d="{CORE}"/>
<path class="flash" fill="{AMBER_HOT}" opacity="{flash:.6f}" d="{CORE}"/>
<g clip-path="url(#chip)" fill="{AMBER}">
  {pin_layer}
</g>
</svg>
'''


def run(args: list[str], **kwargs) -> None:
    subprocess.run(args, check=True, **kwargs)


def render_gif(frames: Path, destination: Path, size: int, colors: int) -> None:
    filters = (f'[0:v]scale={size}:{size}:flags=lanczos,split[frames][stats];'
               f'[stats]palettegen=max_colors={colors}:reserve_transparent=0[palette];'
               '[frames][palette]paletteuse=dither=none:diff_mode=rectangle')
    temporary = frames / f"unoptimized-{size}.gif"
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
         '-filter_complex_threads', '1', '-framerate', str(FPS),
         '-i', str(frames / '%03d.png'), '-filter_complex', filters,
         '-loop', '0', str(temporary)])
    run(['gifsicle', '--optimize=3', '--careful', str(temporary),
         '--output', str(destination)])


def gif_delays(path: Path) -> list[float]:
    info = subprocess.run(['gifsicle', '--info', str(path)],
                          capture_output=True, text=True, check=True).stdout
    return [float(value) for value in re.findall(r"delay ([0-9.]+)s", info)]


def timeline(beats: tuple[float, ...], folder: Path) -> None:
    """Sample the encoded loop at named beats, so the sheet shows real peaks."""
    source = ROOT / 'gif' / 'aels-core-light-512.gif'
    decoded = folder / 'decoded'
    decoded.mkdir()
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
         '-fps_mode', 'passthrough', str(decoded / '%03d.png')])
    frames = sorted(decoded.glob('*.png'))
    delays = gif_delays(source)
    if len(delays) != len(frames):
        raise SystemExit(f"decoded {len(frames)} frames but GIF reports {len(delays)}")
    starts, clock = [], 0.0
    for delay in delays:
        starts.append(clock)
        clock += delay
    picks = []
    for beat in beats:
        index = next((i for i, s in enumerate(starts) if s <= beat < s + delays[i]),
                     len(starts) - 1)
        picks.append(frames[index])
    held = folder / 'beats'
    held.mkdir()
    for order, frame in enumerate(picks):
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(frame),
             '-vf', 'scale=256:256:flags=lanczos', '-frames:v', '1',
             str(held / f'beat_{order:02d}.png')])
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
         '-framerate', '1', '-i', str(held / 'beat_%02d.png'),
         '-vf', 'tile=5x2', '-frames:v', '1', '-update', '1',
         str(ROOT / 'timeline.png')])


def preview_page() -> str:
    seconds = f"{DURATION:g}"
    return f'''<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AELS CORE · 动态图标预览</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: #f8f7f3; color: #142c52; font: 16px/1.7 system-ui,sans-serif; }}
  main {{ max-width: 1120px; margin: 0 auto; padding: 48px 28px; }}
  h1 {{ margin: 0; font-size: 28px; letter-spacing: .05em; }}
  p {{ margin: 8px 0 28px; }}
  .grid {{ display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 24px; }}
  figure {{ margin: 0; overflow: hidden; border: 1px solid #142c5220; border-radius: 20px; }}
  figure img {{ display: block; width: 100%; height: auto; }}
  figcaption {{ padding: 12px 20px; border-top: 1px solid #142c5220; }}
  a {{ color: inherit; text-underline-offset: 4px; }}
  button {{ font: inherit; color: inherit; background: transparent; padding: 8px 18px;
           border: 1px solid #142c5250; border-radius: 8px; cursor: pointer; margin-bottom: 24px; }}
  small {{ display: block; margin-top: 20px; }}
  @media(max-width:640px) {{ .grid {{ grid-template-columns: 1fr; }} }}
</style>
<main>
  <h1>AELS / CORE MOTION</h1>
  <p>内核点着 → 上侧引脚向外扫出 → 下侧引脚接上 → 内核沉回静息。每轮 {seconds} 秒，{FPS} 帧每秒。</p>
  <button id="toggle" type="button" aria-pressed="false">暂停动画</button>
  <div class="grid">
    <figure><img data-theme="light" src="gif/aels-core-light-512.gif" alt="AELS 浅底动态图标" width="512" height="512">
      <figcaption><a href="gif/aels-core-light-512.gif" download>浅底 GIF · 512 像素</a></figcaption></figure>
    <figure><img data-theme="dark" src="gif/aels-core-dark-512.gif" alt="AELS 深底动态图标" width="512" height="512">
      <figcaption><a href="gif/aels-core-dark-512.gif" download>深底 GIF · 512 像素</a></figcaption></figure>
  </div>
  <small>另含 256 像素版本和支持“减少动态效果”偏好的动画 SVG。标识沿用已确认的矢量轮廓。</small>
</main>
<script>
  const button = document.querySelector('#toggle');
  let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function update() {{
    for (const image of document.querySelectorAll('img[data-theme]')) {{
      const theme = image.dataset.theme;
      image.src = paused ? `posters/aels-core-${{theme}}.png` : `gif/aels-core-${{theme}}-512.gif`;
    }}
    button.textContent = paused ? '播放动画' : '暂停动画';
    button.setAttribute('aria-pressed', String(paused));
  }}
  button.addEventListener('click', () => {{ paused = !paused; update(); }});
  update();
</script>
</html>
'''


def main() -> None:
    for tool in ("rsvg-convert", "ffmpeg", "gifsicle"):
        if shutil.which(tool) is None:
            raise SystemExit(f"Missing required tool: {tool}")
    for folder in ("gif", "svg", "posters"):
        (ROOT / folder).mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="aels-core-motion-") as temporary:
        stem = Path(temporary)
        for theme in ("light", "dark"):
            frames = stem / theme
            frames.mkdir()
            for index in range(FRAMES):
                run(['rsvg-convert', '--width', '512', '--height', '512',
                     '--output', str(frames / f'{index:03d}.png')],
                    input=scene(theme, index / FPS), text=True)
            for size, colors in ((512, 256), (256, 96)):
                render_gif(frames, ROOT / "gif" / f"aels-core-{theme}-{size}.gif",
                           size, colors)
            (ROOT / "svg" / f"aels-core-{theme}-animated.svg").write_text(
                scene(theme, animated=True), encoding="utf-8")
            run(['rsvg-convert', '--width', '512', '--height', '512',
                 '--output', str(ROOT / 'posters' / f'aels-core-{theme}.png')],
                input=scene(theme, static=True), text=True)
            print(f"Exported {theme} loops: 512px / 256px, {DURATION:g}s, {FPS}fps.",
                  flush=True)

        # Ten beats that land on the ignition, both pin peaks, and rest.
        timeline((0.00, 0.36, 0.70, 0.84, 1.00, 1.14, 1.62, 1.80, 2.40, 3.00),
                 stem)

    (ROOT / 'preview.html').write_text(preview_page(), encoding="utf-8")

    inventory = []
    for path in sorted(ROOT.rglob('*')):
        if path.is_file() and path.name != 'manifest.json' and '__pycache__' not in path.parts:
            data = path.read_bytes()
            inventory.append({'file': path.relative_to(ROOT).as_posix(),
                              'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
    (ROOT / 'manifest.json').write_text(json.dumps({
        'name': 'AELS CORE motion', 'version': '1.1.0', 'duration_seconds': DURATION,
        'frames_per_second': FPS, 'source_frames': FRAMES, 'loop': 'infinite',
        'files': inventory}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    archive = ROOT.parent / 'aels-core-motion-v1.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as bundle:
        for path in sorted(ROOT.rglob('*')):
            if path.is_file() and '__pycache__' not in path.parts:
                bundle.write(path, f'aels-core-motion-v1/{path.relative_to(ROOT).as_posix()}')
    print(f'Bundle: {archive}', flush=True)


if __name__ == '__main__':
    main()
