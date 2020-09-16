---
title: Introduction
slug: about
order: 0
---

# What is pixi-loopkit

pixi-loopkit, from here on out just "loopkit" makes it a good deal simpler to create looping gifs, visualisations that are timed to music, experiments that are easy to parametrize (more on that in props!), and more. In technical terms, it's a thin wrapper around [PIXI.js](https://pixijs.io/) with additional helper scripts and libraries. In a way, it's a platform to create stuff.

This documentation is a cross between a guide and technical documentation, a how to do things in general, and how to do things in loopkit in specific. Have a look around and who knows, maybe you'll have found yourself a new home!

# Installing

If you are using node package manager, loopkit is up on npm:

```bash
npm install pixi-loopkit
```

Alternatively, you can download the minified version from github and just include that in your project (obvi, more info here later, right now npm is to way to go though).

# Hello World

A minimal example to get us started. You should see the result on the right. Hint: it's a turquoise rectangle.

```javascript
// get loopkit using ES6 imports
import {LoopKit} from "pixi-loopkit";

// create a new LoopKit instance. The first param, ".kit" is the CSS selector
// of the container. The second param is options (like here - background color).
let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
});

// get direct access to the drawing surface
// set line to be 3 pixels thick and turquoise
// and draw a rectangle (x, y, width, height), and mind the half-pixel
let graphics = kit.graphics;
graphics.lineStyle(3, "turquoise");
graphics.drawRect(100.5, 100.5, 100, 100);
```

`kit.graphics` is a thinly wrapped [Pixi.js' Graphics object](http://pixijs.download/release/docs/PIXI.Graphics.html) that you can use to directly draw on. Check out Pixi's documentation for full details. In essence it can do lines,
squares, circles, ellipses, arcs, bezier curves, as well as you can nest graphics into graphics (more on that later).

Loopkit adds only one tiny but essential feature to Pixi's graphics - you can specify colors in any format you like. All colors in loopkit are [chroma.js](https://gka.github.io/chroma.js/) colors - allowing you to use symbolic names, HSL (hue, saturation, lightness) triplets, blending, and everything else. It's a rather excellent library, so be sure to check out [their documentation](https://gka.github.io/chroma.js/)!

Now, try clicking on the square and then press the "P" keyboard button. You should be offered with a capture of what you're seeing. Loopkit has a built-in exporter that will allow you get your work from code into PNGs and GIFs in no time

# Let's get moving

Let's add some movement! If you hover over the two squares, they should start moving. You can click to pause/resume the rotation.

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";

// We can either draw straight onto the kit's surface, or we can work with
// child nodes. One of the benefits of thinking in nested objects is that
// it's easy to move them around, rotate and so on - same as you would
// in HTML! We are defining a class for a "square" object here.
class Square extends Graphics {
    constructor(size) {
        super();

        // Simple center for demo purposes - our tiny canvas is 300x300
        [this.x, this.y] = [150, 150];

        // Setting line 3px wide and magenta, with a bit of opacity
        // It is also possible to use RGBA hex codes (among many others)
        this.lineStyle(3, "magenta", 0.3);
        this.drawRect(-size / 2, -size / 2, size, size);
    }
}

// We're already familiar with the kit itself
let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        // The onFrame property is new - it's called on every frame.
        // In here we can do drawing, or changing things around.
        // Currently, we are just turning the rects clockwise and counter
        rect.rotation += 0.01;
        rect2.rotation -= 0.01;
    },
});

// Creating the squares we are changing above, and adding them to the kit
let rect = new Square(150);
let rect2 = new Square(120);
kit.addChild(rect, rect2);
```

And we are off to the races!

If you click on the two rotating squares, and hit Shift+E on keyboard, you should be offered to download an archive - try it out!

The archive is a tar file, and hopefully your file manager will know how to deal with it. Once you've managed to unzip it, you'll see a `/frames` folder that contains all the individual frames, as well as in the root folder you'll find three shell scripts. The shell scripts use `ffmpeg` to convert the PNG frames into a looping GIF or, if the necessity calls for a video, a roughly 30 second mp4 video.

One more keystroke! Try clicking into the squares and hitting "R" on the keyboard. This will render each frame on top of each other. That can be useful for debugging, as well as can render an interesting view of your animation. Press Shift+R if you'd like to download the image.

# Onwards to loops

Hopefully this brief overview has given you some idea as to what loopkit is about. To summarize - it's a tiny library (~50k unzipped), sitting on top of [Pixi.js](https://www.pixijs.com/), using [Chroma.js](https://gka.github.io/chroma.js/) and other helper libraries to create an environment where you can focus on creating. Keep reading to learn how to loop using normalized (0 to 1) values like a pro, how to switch loopkit between framecount mode and BPM (beats-per-minute) mode, how to attach sound, what's the best way to get high-resolution renders, and other nifty features. You might pick up a bit of maths as we move along as well!

[Onwards to "Working with loops" (this link no worky because there is no content yet)](/)