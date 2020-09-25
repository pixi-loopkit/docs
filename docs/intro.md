---
title: pixi-loopkit
order: 0
slug: intro
---

# What is pixi-loopkit

Pixi-loopkit makes it simple to create looping gifs, visualisations that are timed to music, experiments that are easy to parametrize (more on that in [props](/props)), and all that in your browser and so - totally portable. It's a thin wrapper around [PIXI.js](https://pixijs.io/) with additional helper scripts and libraries to help you focus on the making.

This documentation is a part guide and part technical documentation. If you know where you're going - jump straight to the [reference](/reference). Otherwise, keep reading - there is lots of fun stuff to cover!

> To keep things concise, all the code examples build on previous ones. If you get lost, just scroll up to the previous sections and see if maybe some of the other examples explain what's going on!


# Show me the code

Code's in GitHub https://github.com/pixi-loopkit. Pull requests and improvement suggestions welcome!


# Install & Run

Loopkit is available on NPM:

```bash
npm install pixi-loopkit
```

You can also download a minified version from github and include that in your project (more info here later; right now though `npm` is the way to go).

# Barebones example

Here's a minimal example to get us started. You should see a turquoise rectangle on the right. Read the code comments for explanations.

```javascript
// import loopkit with ES6 imports
import {LoopKit} from "pixi-loopkit";

// Create a new kit instance. The first param, ".kit" is the CSS selector
// of the container (you can pass in a string, or a reference to the div.
// The second param is {options} (here we're only specifyng background color).
let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
});

// Drawing straight on the kit's surface.
// Setting line to be 4 pixels thick and turquoise,
// and drawing a rectangle (x, y, width, height).
kit.graphics.lineStyle(4, "turquoise");
kit.graphics.drawRect(100, 100, 100, 100);
```

`kit.graphics` is a thinly wrapped [Pixi.js' Graphics](http://pixijs.download/release/docs/PIXI.Graphics.html) object that you can use to directly draw on the canvas, as in the example above. It can do lines, squares, circles, ellipses, arcs, and bezier curves among other things, and you can nest graphics into other graphics as well (more on that later!) Since Pixi itself is sitting on top of WebGL2, you can also do shaders and whatnot. Check out [Pixi's documentation](http://pixijs.download/release/docs/PIXI.Graphics.html) for full details.

Loopkit adds one essential feature to Pixi's graphics: you can specify colors in any format you like. All colors in loopkit are [chroma.js](https://gka.github.io/chroma.js/) colors, allowing you to use symbolic names (like "red", or "fuchsia"), HSL (hue, saturation, lightness) triplets, blending, and everything else. It's a rather excellent library, so be sure to check out [their documentation](https://gka.github.io/chroma.js/)!

> Keyboard shortcut time! Click on the square above and then press the "p" button on your keyboard. You should be offered to download a capture of what you're seeing. Loopkit has a built-in exporter that will allow you get your work from code into PNGs, GIFs, and MP4s in no time.

## Let's get moving

Let's add some movement! If you hover over the two squares below, they should start moving. You can click to pause/resume the rotation (same applies for all other examples here).

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";

// Instead of drawing straight on the surface, we can also nest graphics
// objects. One of the benefits of thinking in nested objects is that
// it's easy to move them around, rotate and so on - same as you would
// in HTML! Below is our version of a square that we will add to kit.
class Square extends Graphics {
    constructor(size) {
        // we are extending the Graphics class, so need to super()
        super();

        // Simple centering for demo purposes - our tiny canvas is 300x300
        [this.x, this.y] = [150, 150];

        // Setting the line width and color, with a bit of opacity
        // It is also possible to use RGBA hex codes (among many others)
        this.lineStyle(4, "magenta", 0.3);
        this.drawRect(-size / 2, -size / 2, size, size);
    }
}

// We're already familiar with the kit itself
let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        // The onFrame is called on every frame.
        // In here we can draw, as well as perform any other changes.
        // Currently, we are just turning the rects (defined below) clockwise and counter
        rect.rotation += 0.01;
        rect2.rotation -= 0.01;
    },
});

// Creating the inner and outer square and adding them to the kit
let rect = new Square(150);
let rect2 = new Square(120);
kit.addChild(rect, rect2);
```

And we are off to the races! Jumping ahead a little, here's another keyboard shortcut: if you click on the two squares above and hit Shift+E on, you should be offered to download a `.tar` archive. Try it out!

Tar files are archives just like zip, so if your file manager is lost, see if you can google up how to get it open. Once you've managed to unzip it, you'll see a `/frames` folder that contains all the individual frames, as well as in the root folder you'll find a bunch of shell scripts, running which will produce GIFs and MP4s. The scripts use `ffmpeg` to do all the heavy lifting.

> One more keystroke! Click into the squares and hit "r" on the keyboard. This will run the full loop, and render all frames on top of each other. This can be useful for debugging, as well as for generating cool stills of your animation. Press Shift+R if you want to save the image.

## Onwards to loops

In summary, loopkit is a tiny library (under ~50k unzipped), sitting on top of [Pixi.js](https://www.pixijs.com/), using [Chroma.js](https://gka.github.io/chroma.js/) and other helper libraries to create an environment where you can focus on creating. Keep reading to learn how to loop using normalized (0..1) values like a pro, how to switch loopkit between framecount mode and BPM (beats-per-minute) mode, how to attach sound, what's the best way to get high-resolution renders, and other nifty features. Or jump straight to the reference!

[Onwards to "Working with loops"](/loops)
