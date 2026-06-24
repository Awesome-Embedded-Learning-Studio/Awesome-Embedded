---
title: "Why Another Awesome C++ List? Because Links Are Not Enough"
description: "Don't get the wrong idea — Tutorial_AwesomeModernCPP isn't a link list at all. 'Awesome' is just this tutorial series' naming convention."
---

# Why Another Awesome C++ List? Because Links Are Not Enough

Let's clear up the biggest misunderstanding first: [Tutorial_AwesomeModernCPP](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP) (we'll call it TAMCPP for short) is **not an Awesome C++ list**. The "Awesome" in the repo name is just the naming convention of the Awesome-Embedded-Learning-Studio tutorial series — right next to it you'll find [Tutorial_AwesomeQt](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeQt) and Tutorial_AwesomeHardware, all prefixed "Tutorial_Awesome*". Its own positioning is spelled out plainly: "a systematic modern C++ tutorial oriented toward engineering practice" — it's a **tutorial**, not an awesome-list.

So this post isn't here to trash the lists. Quite the opposite — the existing lists are genuinely useful, and the author still flips through them every day. What we want to make clear is that TAMCPP isn't even in the same category as them. A list answers "what's out there"; a tutorial answers "what do I read next, in what order, with what background, and how do I actually practice it." Two different things, existing side by side.

## The lists already do their job — respect them

I'm happy to share a few of these remarkable open-source projects:

- [awesome-cpp](https://github.com/fffaraz/awesome-cpp)
- [awesome-modern-cpp](https://github.com/rigtorp/awesome-modern-cpp)

along with the famous, authoritative [cppreference](https://cppreference.com/) — the site everyone drags out when they need to settle an argument.

Most C++ developers will turn to these reference shelves sooner or later. They're broad, they're maintained, and every PR that adds a good library makes them a little better.

Where lists genuinely shine: **discovery, breadth, and staying current.** A community-maintained list can keep up with a fast-moving ecosystem — a real advantage no single tutorial can match. TAMCPP leans on these lists rather than trying to replace them. Truth is, after working through our tutorial, you'll be better equipped to pick things out of those lists.

## Where a link list stops being enough

A link tells you "this thing exists." It doesn't tell you what to learn first, what you can safely skip on a first pass, or which C++17 feature quietly assumes which C++11 foundation — let alone how two features interact, or why a certain pattern shows up over and over in real codebases.

The gap here isn't coverage — the links are already out there. The gap is **narrative and ordering**: a path through the material, with prerequisites made explicit and the "why" attached to the "what."

## What TAMCPP actually is

In one line: a learning path with compilable examples. Here's what it looks like —

**A ten-volume course, not a catalog.** TAMCPP is organized into ten volumes in sequence: Vol 1 C++ fundamentals, Vol 2 modern features, Vol 3 the standard library, Vol 4 advanced topics, Vol 5 concurrency, Vol 6 performance, Vol 7 engineering practice, Vol 8 domain applications, Vol 9 reading open-source projects, Vol 10 course notes. The point isn't "this is the only way to learn C++" — it's that there's an order, where each volume assumes you've read the ones before it. That kills the paralysis of "where do I even start." On top of that, there are three side tracks: cpp-reference feature cheat-sheets, a compilation track, and a projects track.

**Engineering context, not just a feature list.** For each feature, we want to explain why it exists and where it shows up in real code. Move semantics isn't "here's `std::move`" — it's "that copy you keep paying for, why it matters, and what the pattern that uses it well looks like." This kind of context is exactly what a link collection can't give you — because it's not a property of the link, it's a property of the explanation around the link.

**Practice over indexing.** This is the most important difference. Every example is organized as a CMake project that actually compiles in CI — a list points you at code; a tutorial hands you code you can build, break, and fix on your own machine. CI runs two lines: one builds on the host with `g++-14`, the other cross-compiles to STM32 with `arm-none-eabi`. Because a lot of us work in the embedded corner, Vol 8 has a full STM32F1 (STM32F103C8T6) hands-on track, from lighting up an LED to a UART logger — each a real project with its own linker script and HAL config. And that track is still growing vigorously!

The whole thing also runs on a VitePress docs site we built ourselves, with search, navigation, and dark mode, auto-deployed to GitHub Pages. So if you like, you're free to fork it and shape it into your very own C++ learning site!

## Who it's for

TAMCPP is for people who want to learn C/C++ systematically and avoid wandering through fragmented material; for developers with C or embedded experience who want to put modern C++ to work in real engineering; and for existing C++ developers who want to strengthen concurrency, performance, build systems, debugging, and source-code reading. It's also honest about what it isn't: it reflects one particular path through the language, with all the biases and blind spots that implies. If you're already deep in template metaprogramming or chasing the latest standardization drafts, those lists will serve you better.

## Where to go next

If "a path, not a list" resonates with you — if you've been drowning in C++ tabs and want a single sequence to walk — the repo is where the volumes actually live:

👉 [Tutorial_AwesomeModernCPP on GitHub](https://github.com/Awesome-Embedded-Learning-Studio/Tutorial_AwesomeModernCPP)

Like the awesome-cpp lists, it gets better the more eyes are on it. If you spot a gap, a mistake, or a chapter that lost you — that's exactly the kind of feedback that turns a tutorial into something the whole community can learn from.
