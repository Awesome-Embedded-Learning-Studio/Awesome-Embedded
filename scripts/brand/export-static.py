#!/usr/bin/env python3
"""Export the approved AELS CORE identity from one shared vector construction.

Requires Python 3 and rsvg-convert (librsvg). No Python packages are needed.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil
import struct
import subprocess
import zipfile


ROOT = Path(__file__).resolve().parent
NAVY = "#142C52"
AMBER = "#E6A83D"
PAPER = "#F8F7F3"
WHITE = "#FFFFFF"
PNG_SIZES = (16, 32, 48, 64, 128, 256, 512, 1024, 2048)
AVATAR_SIZES = (256, 512, 1024, 2048)
FAVICON_SIZES = (16, 32, 48, 64, 128, 256)

# Shared 1024-unit canvas. The chip is one continuous outline, including pins.
# Left and right geometry mirror exactly about x=512.
CHIP = """
M 280 234 H 744
C 781.555 234 812 264.445 812 302
V 364 H 892 Q 912 364 912 384
V 429 Q 912 449 892 449 H 812
V 526 H 892 Q 912 526 912 546
V 591 Q 912 611 892 611 H 812
V 722 C 812 759.555 781.555 790 744 790
H 280 C 242.445 790 212 759.555 212 722
V 611 H 132 Q 112 611 112 591
V 546 Q 112 526 132 526 H 212
V 449 H 132 Q 112 449 112 429
V 384 Q 112 364 132 364 H 212
V 302 C 212 264.445 242.445 234 280 234 Z
""".strip()

LETTER = """
M 450 318 H 574
Q 585 318 591 330
L 780 704 Q 790 724 768 724
H 660 Q 647 724 641 712
L 521 476 Q 512 459 503 476
L 383 712 Q 377 724 364 724
H 256 Q 234 724 244 704
L 433 330 Q 439 318 450 318 Z
""".strip()

CORE = """
M 480 636 H 544 Q 556 636 556 648
V 712 Q 556 724 544 724
H 480 Q 468 724 468 712
V 648 Q 468 636 480 636 Z
""".strip()


def mark(color: str = NAVY, monochrome: bool = False) -> str:
    """The A and monochrome core are true transparent even-odd cutouts."""
    cutouts = f"{CHIP} {LETTER}" + (f" {CORE}" if monochrome else "")
    result = f'<path fill="{color}" fill-rule="evenodd" d="{cutouts}"/>'
    if not monochrome:
        result += f'\n<path fill="{AMBER}" d="{CORE}"/>'
    return result


def svg_document(content: str, title: str, width: int = 1024,
                 height: int = 1024) -> str:
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}"
     viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
  <title id="title">{title}</title>
  <desc id="desc">AELS CORE: a symmetric chip with two pins on each side,
  a geometric A cutout, and a small square kernel.</desc>
{content}
</svg>
'''


def write_svg(name: str, content: str, title: str) -> Path:
    destination = ROOT / "svg" / f"{name}.svg"
    destination.write_text(svg_document(content, title), encoding="utf-8")
    return destination


def render(source: Path, destination: Path, size: int | None = None,
           fmt: str = "png") -> None:
    args = ["rsvg-convert", "--format", fmt]
    if size is not None:
        args.extend(["--width", str(size), "--height", str(size)])
    args.extend(["--output", str(destination), str(source)])
    subprocess.run(args, check=True)


def ico_from_pngs(images: list[tuple[int, Path]], destination: Path) -> None:
    """Package rendered PNG streams directly, with no bitmap resampling."""
    offset = 6 + 16 * len(images)
    entries = []
    payloads = []
    for size, filename in images:
        data = filename.read_bytes()
        entries.append(struct.pack("<BBBBHHII", size % 256, size % 256,
                                   0, 0, 1, 32, len(data), offset))
        payloads.append(data)
        offset += len(data)
    destination.write_bytes(struct.pack("<HHH", 0, 1, len(images))
                            + b"".join(entries) + b"".join(payloads))


def preview() -> str:
    def placed(x: float, y: float, size: float, content: str) -> str:
        return (f'<g transform="translate({x} {y}) scale({size / 1024})">'
                f'{content}</g>')

    def label(x: int, y: int, text: str, size: int = 18,
              color: str = NAVY) -> str:
        return (f'<text x="{x}" y="{y}" fill="{color}" '
                f'font-family="DejaVu Sans, sans-serif" font-size="{size}"'
                f'>{text}</text>')

    contents = [
        f'<rect width="1600" height="1000" fill="{PAPER}"/>',
        label(72, 65, "AELS / CORE", 27),
        label(72, 103, "VECTOR MASTER / v1", 15),
        f'<path d="M 956 136 V 816" stroke="{NAVY}" stroke-opacity="0.15"/>',
        placed(24, 42, 920, mark()),
        f'<rect x="1060" y="120" width="320" height="320" rx="36" fill="{NAVY}"/>',
        placed(1060, 120, 320, mark(WHITE)),
        label(1060, 477, "DARK BACKGROUND", 16),
        placed(1078, 493, 284, mark(monochrome=True)),
        label(1060, 786, "ONE COLOR / TRUE CUTOUTS", 16),
        label(72, 864, "FAVICON / ACTUAL PIXEL SIZES", 15),
        label(1060, 862, "NAVY  #142C52", 16),
        label(1060, 897, "AMBER  #E6A83D", 16),
        label(1060, 932, "LIGHT  #F8F7F3", 16),
    ]
    for x, size in ((80, 16), (200, 32), (340, 48), (500, 64)):
        contents.append(placed(x, 916 - size, size,
                               f'<g transform="translate(512 512) scale(1.2) '
                               f'translate(-512 -512)">{mark()}</g>'))
        contents.append(label(x, 946, f"{size} px", 14))
    return svg_document("\n".join(contents), "AELS CORE export preview", 1600, 1000)


def main() -> None:
    if shutil.which("rsvg-convert") is None:
        raise SystemExit("Install librsvg / rsvg-convert before exporting.")
    for folder in ("svg", "png", "avatars", "favicon", "pdf", "reference"):
        (ROOT / folder).mkdir(exist_ok=True)

    variants = {
        "aels-core-primary": (mark(), "AELS CORE — navy and amber"),
        "aels-core-reverse": (mark(WHITE), "AELS CORE — white and amber"),
        "aels-core-mono-navy": (mark(monochrome=True), "AELS CORE — navy monochrome"),
        "aels-core-mono-black": (mark("#000000", True), "AELS CORE — black monochrome"),
        "aels-core-mono-white": (mark(WHITE, True), "AELS CORE — white monochrome"),
    }
    for name, (content, title) in variants.items():
        source = write_svg(name, content, title)
        for size in PNG_SIZES:
            render(source, ROOT / "png" / f"{name}-{size}.png", size)

    for theme, background, foreground in (("light", PAPER, NAVY),
                                          ("dark", NAVY, WHITE)):
        content = f'<rect width="1024" height="1024" fill="{background}"/>\n'
        content += mark(foreground)
        name = f"aels-core-avatar-{theme}"
        source = write_svg(name, content, f"AELS CORE — {theme} avatar")
        for size in AVATAR_SIZES:
            render(source, ROOT / "avatars" / f"{name}-{size}.png", size)

    favicon = ROOT / "favicon" / "favicon.svg"
    favicon.write_text(svg_document(
        '<g transform="translate(512 512) scale(1.2) translate(-512 -512)">'
        + mark() + '</g>', "AELS CORE favicon"), encoding="utf-8")
    favicon_pngs = []
    for size in FAVICON_SIZES:
        destination = ROOT / "favicon" / f"favicon-{size}.png"
        render(favicon, destination, size)
        favicon_pngs.append((size, destination))
    ico_from_pngs(favicon_pngs, ROOT / "favicon" / "favicon.ico")

    render(ROOT / "svg" / "aels-core-avatar-light.svg",
           ROOT / "favicon" / "apple-touch-icon.png", 180)
    render(ROOT / "svg" / "aels-core-primary.svg",
           ROOT / "pdf" / "aels-core-primary.pdf", fmt="pdf")
    render(ROOT / "svg" / "aels-core-mono-black.svg",
           ROOT / "pdf" / "aels-core-mono-black.pdf", fmt="pdf")

    (ROOT / "preview.svg").write_text(preview(), encoding="utf-8")
    render(ROOT / "preview.svg", ROOT / "preview.png")

    inventory = []
    for path in sorted(ROOT.rglob("*")):
        if path.is_file() and path.name != "manifest.json" and "__pycache__" not in path.parts:
            inventory.append({"file": path.relative_to(ROOT).as_posix(),
                              "bytes": path.stat().st_size,
                              "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    manifest = {"name": "AELS CORE", "version": "1.0.0",
                "canvas": {"width": 1024, "height": 1024},
                "colors": {"navy": NAVY, "amber": AMBER, "light": PAPER},
                "files": inventory}
    (ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)
                                         + "\n", encoding="utf-8")

    archive = ROOT.parent / "aels-core-v1.zip"
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as bundle:
        for path in sorted(ROOT.rglob("*")):
            if path.is_file() and "__pycache__" not in path.parts:
                bundle.write(path, f"aels-core-v1/{path.relative_to(ROOT).as_posix()}")
    print(f"Exported {len(inventory)} files plus manifest: {ROOT}")
    print(f"ZIP: {archive}")


if __name__ == "__main__":
    main()
