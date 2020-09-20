---
title: Reference
order: 500
---

# LoopKit

### new LoopKit(container, {options})

-   **Arguments:**

    -   `{Element | string} container` - CSS selector or the actual DOM node to which loopkit should attach to. Loopkit will add a canvas element to the container.
    -   `{Object} options`
        -   `{Function} onFrame` - callback to call on each frame. The callback will receive `kit.graphics` as well as normalized version (0..1) of the current frame.
        -   `{boolean} antialias` - Whether the scene should be antialiased. Defaults to `true`.
        -   `{string | number | Object | Chroma.color} bgColor` - Background color of the scene.
        -   `{number} frames` - number of frames in the loop. This determines the loop length.
        -   `{boolean} debugKeystrokes` Adds a few handy keystrokes to canvas. Defaults to `true`.
        -   `{number} bpm` - Beats per minute. When set, switches Loopkit's ticker to time-exact mode.
        -   `{number} beatsPerLoop` - How many beats should count as one loop. Defaults to `1`
        -   `{Function} onBeat` - gets called on each beat. The exact time will depend on `bpm` and `beatsPerLoop`.
        -   `{string} name` - used only when creating export scripts to simplify file management

-   **Usage:**
    <p>
        Create a new instance of loopkit.
    </p>

*   **Example:**

    ```js
    let kit = new LoopKit(".kit", {
        bgColor: "white",
        onFrame: (g, frame) => {
            g.clear();
            g.lineStyle(1, "green");
            g.drawRect(10, 10, 10 + frame * 100, 10 + frame * 100);
        })
    });
    ```

-   **Option: onFrame**<br />
    If specified, the callback gets called when the frame is ready for drawing. This is the right place to redraw any graphics. The callback will receive `kit.graphics` as the first param, and normalized version (0..1) of the current frame as the second param.

-   **Option: antialias**<br />
    Set to false if you are working on a pixelart project or don't want any smooshing to happen

-   **Option: bgColor**<br />
    bgColor accepts most formats you could think of

-   **Option: frames**<br />
    The `frames` will affect the pace at which `frame` variable passed into `onFrame` will go from 0 to 1. PIXI refresh rate is about 60 frames per second, so setting frames to 30 will result in a 0.5 second loop, while setting it to 180 - in a three second loop.
-   **Option: debugKeystrokes**<br />
    Enabled by default, this attaches a few handy keystrokes to the scene:
    -   `Spacebar` binds to `.pause()` - pauses/unpauses the loopkit.
    -   `Left Arrow` binds to `.loop.tick()` - moves loop 10 frames back. `Shift + Left Arrow` will move the loop back 1 frame.
    -   `Right Arrow` binds to `.loop.tick()` - moves loop 10 frames ahead. `Shift + Left Arrow` will move the loop 1 frame ahead.
    -   `R` binds to `.exportStill()` - pauses the loopkit and renders all frames of the loop on top of each other.
    -   `Shift+R` binds to `.exportStill()` - pauses the loopkit and renders all frames of the loop on top of each other, and exports the result as a PNG.
    -   `Shift + E` binds to `.exportLoop()` - exports all frames of the loop as PNGs packed into a TAR archive.
    -   `Shift + P` binds to `.pause()` - pauses/unpauses the loopkit.
-   **Option: bpm**<br />

-   **Option: beatsPerLoop**<br />
-   **Option: onBeat**<br />
-   **Option: name**<br />

## Properties

### container

Pointer to the HTMLElement containing loopkit, in case you've lost the handle somehow.

### width

The current width of the canvas. Use it to determine placement for whatever you are drawing

### height

The current height of the canvas. Use it to determine placement for whatever you are drawing

### canvas

Kit's [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement).

> In modern browsers canvas is running in WebGL2 mode, so if you need to get access to the context, you should call `.canvas.getContext("webgl2")`

### loop

Kit's looper. See [Loop](/reference#Loop).

### bpm

Beats per minute. When specified, loopkit switches from sequential looping (meaning all frames will be renderer one after another, no matter how long it takes), to timer-based looping.

-   **Usage**:<br />
    Set bpm when you want match the visuals to a particular beat.
-   **Details**:<br/>
    Thinking in frames, if you set bpm to 120, that amounts to 120/6 = 2 beats per second. PIXI renders 60 frames per second, so one beat will be half that, or 30 frames.
    In this example your loop will effectively be 30 frames long.
    In many cases this will be too fast, which is where `beatsPerLoop` comes in - we can specify how many beats we want to count as a single loop. If at 120 bpm, we specify that we'd like to pack 2 beats in a single loop, we will effectively end up with a 60 frame loop.

    For better understanding, check out [this experiment](https://tomstriker.org/x/bpm). Use Up/Down keyboard buttons to change `bpm`, and Left/Right to increase/decrease `beatsPerLoop`.

    > Even with bpm mode specified, you can still run exports. During export, loopkit will consult the `frames` property for how many frames it should render.

### beatsPerLoop

Current beatsPerLoop. Defaults to 1, and is not used, unless you have specified bpm.

-   **Usage**:<br />
    See [`bpm`](/reference#bpm) for full explanation.

### beat

Access to kit's Beat object. Not used, unless bpm is specified See [Beat](/reference#Beat).

### name

Experiment name for exports.

-   **Usage**:<br />
    Used when generating out PNGs and the TAR archive, as well as for naming scripts in the archive. Handy when you are juggling several experiments.

### renderer

Access to PIXI.renderer. See [PIXI's documentation](http://pixijs.download/release/docs/PIXI.Renderer.html) for full details.

### bg

Current background color.

-   **Usage**:<br />
    You can change the background on the fly! Accepts all good colors.

### graphics

Access to kit's main surface (`Graphics`).

-   **Usage**:<br />
    Use it to either draw directly on the surface, or manipulate the children. The `Graphics` object is a thin wrapper around `PIXI.Graphics`, see [PIXI's documentation](http://pixijs.download/release/docs/PIXI.Graphics.html) for full details. The only difference between PIXI's Graphics object and loopkit's is that you can specify colors in any format.

### frame

Current frame of the loop in the normalized 0..1 form. Meaning 0 is first frame, 0.5 is "half way there", and ~0.99 the last frame. Note - current frame is never 1, as it rolls over to the next iteration and is 0, instead.

-   **Usage**:<br />
    Set the `frame` to reset the current position in the loop.

### fps _`read-only`_

Returns current frames per second. You can use it to gauge as to whether the machine can't take any more abuse (e.g. that redrawing a million circles on each frame might be a few degrees of magnitude too much, after all).

### children

A convenience shortcut to `.graphics.children`

## Methods

### render()

-   **Usage**:<br />
    Call this whenever you need to redraw the frame. Takes no effect if loopkit is running.

### start()

-   **Usage**:<br />
    Starts loopkit in case if it has been stopped

### stop()

-   **Usage**:<br />
    Stop the loopkit in case if it's running

### pause()

-   **Usage**:<br />
    Pause / unpause the loopkit

### addChild(...elements)

-   **Usage**:<br />
    A convenience shortcut to `kit.graphics.addChild`

### removeChild(...elements)

-   **Usage**:<br />
    A convenience shortcut to `kit.graphics.removeChild`

### export(filename)

-   **Usage**:<br />
    Export current frame. If filename is not specified, will return the result of `canvas.toDataURL()`.
    If filename is specified, will trigger a file download

    > Filename should have a `.png` extension as the output is a PNG.

### `async` exportLoop()

-   **Usage**:<br />
    Pauses loopkit, and exports all frames in a tar archive.

### exportStill(filename, opacity)

-   **Arguments**:z

    -   `{string} filename`
    -   `{float} opacity`

-   **Usage**:<br />
    Pauses loopkit, and renderers all frames on top of each other.

### resize()

-   **Usage**:<br />
    Resizes loopkit to fit the container. Call if you have resized the container. By default elements like growing, but not shrinking. To avoid that, you can set container's size explicitly and set `overflow: hidden` in CSS.

### destroy()

-   **Usage**:<br />
    Stops loopkit, removes any internal listeners, calls PIXI.js's cleanup functions, removes the canvas element and performs WebGL's context cleanup. If you are running loopkit in a hot-reload environment, call the destroy function in the appropriate listener.

# Loop / kit.loop

accessed via kit.loop

# Graphics

So you don't have to specify colors in hex

# Props

Make experimentation much simpler

# Easing

Makes things ease-y (i'll show myself out)

# RC

RC stands for remote(-ish) control.

# Sound

When you want to react to sound

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";
let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
});

let graphics = kit.graphics;
graphics.lineStyle(3, "#666");
graphics.drawRect(100.5, 100.5, 100, 100);
```

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";

class Square extends Graphics {
    constructor(x, y, w, h) {
        super();
        [this.x, this.y] = [x + w / 2, y + h / 2];

        this.lineStyle(3, "#555");
        this.drawRect(-w / 2, -h / 2, w, h);
    }
}

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: () => {
        rect.rotation += 0.01;
    },
});

let rect = new Square(100, 100, 100, 100);
kit.addChild(rect);
```
