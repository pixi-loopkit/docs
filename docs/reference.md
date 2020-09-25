---
title: Reference
order: 500
---

# LoopKit

### new LoopKit(container, {options})

-   **Arguments:**

    -   `{Element | string} container` - CSS selector or DOM node to which loopkit should attach to. Loopkit will add a canvas element to the container.
    -   `{Object} options` - kit options.

-   **Usage:**<br />
    Create a new instance of loopkit.

-   **Options:**

    -   **`{Function} onFrame(g, frame)`**<br />
        If specified, the callback gets called when the frame is ready for drawing. This is the place to do calculations and redraw any graphics. The callback will receive [`kit.graphics`](#graphics) as the first param, and normalized version (0..1) of the current frame as the second param.

    -   **`{boolean} antialias`**<br />
        Whether the scene should be antialiased. Set to false if you are working on a pixelart project or don't want any smooshing to happen. Defaults to `true`.

    -   **`{string | number | Array | Object | Chroma.color} bgColor`**<br />
        Background color of the scene. Accepts any format that chroma.js supports. See [chroma.js reference](https://gka.github.io/chroma.js/#chroma) for details.

    -   **`{number} frames`**<br />
        How many frames should the loop have. This will have direct effect on how quickly the loop runs (the framerate will stay constant, but the change will happen faster). PIXI refresh rate is about 60 frames per second, so setting frames to 30 will result in a 0.5 second loop, while setting it to 180 - in a three second loop.

    -   **`{boolean} debugKeystrokes`**<br />
        Enabled by default, this attaches a few handy keystrokes to the scene:
        -   `Spacebar` binds to [`.pause()`](#pause) and pauses/unpauses the loopkit.
        -   `Left Arrow` binds to [`.loop.tick()`](#tick) and moves loop 10 frames back. `Shift + Left Arrow` will move the loop back 1 frame.
        -   `Right Arrow` binds to [`.loop.tick()`](#tick) and moves loop 10 frames ahead. `Shift + Left Arrow` will move the loop 1 frame ahead.
        -   `R` binds to [`.exportStill()`](#exportStill) and pauses the loopkit and renders all frames of the loop on top of each other.
        -   `Shift+R` binds to `.exportStill()` and pauses the loopkit and renders all frames of the loop on top of each other, and exports the result as a PNG.
        -   `Shift + E` binds to `.exportLoop()` and exports all frames of the loop as PNGs packed into a TAR archive.
        -   `Shift + P` binds to `.pause()` and pauses/unpauses the loopkit.
    -   **`{number} bpm`**<br />
        Beats per minute. When set, switches Loopkit's ticker to time-exact mode. See below for more details.
    -   **`{number} beatsPerLoop`**<br />
        How many beats should count as one loop. Defaults to `1`
    -   **`{Function} onBeat()`**<br />
        Gets called on each beat. The exact time will depend on `bpm` and `beatsPerLoop`.
    -   **`{string} name`**<br />
        used only when creating export scripts to simplify file management

*   **Example:**

    ```javascript
    let kit = new LoopKit(".kit", {
        bgColor: "white",
        frames: 120,
        onFrame: (g, frame) => {
            g.clear();
            g.lineStyle(1, "green");
            frame = Math.max(frame, 0.01);
            g.drawRect(
                kit.width / 2 - (frame * kit.width) / 2,
                kit.height / 2 - (frame * kit.height) / 2,
                frame * kit.width,
                frame * kit.height
            );
        },
    });
    ```

## Properties

### width

The current width of the canvas. Use it to determine placement for whatever you are drawing

### height

The current height of the canvas. Use it to determine placement for whatever you are drawing

### canvas

Kit's [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement).

> In modern browsers canvas is running in WebGL2 mode, so if you need to get access to the context, you can do `kit.canvas.getContext("webgl2")`

### loop

Kit's looper. Access it to reset the frame, or to get hands on the utility functions. See [Loop](#loop-1) for details.

### bpm

Beats per minute. When specified, loopkit switches from sequential looping (meaning all frames will be renderer one after another, no matter how long it takes), to timer-based looping (meaning it will check how much time has passed since last frame, and figure out what frame we are on based on BPM).

-   **Usage**:<br />
    Set bpm when you want match the visuals to a beat.
-   **Details**:<br/>
    Thinking in frames, if you set bpm to 120, that amounts to 120/6 = 2 beats per second. PIXI renders 60 frames per second, so one beat will be half that, or 30 frames.
    In this example your loop will effectively be 30 frames long.
    In many cases this will be too fast, which is where `beatsPerLoop` comes in - we can specify how many beats we want to count as a single loop. If at 120 bpm, we specify that we'd like to pack 2 beats in a single loop, we will effectively end up with a 60 frame loop.

    For better understanding, check out [this experiment](https://tomstriker.org/x/bpm). Use Up/Down keyboard buttons to change `bpm`, and Left/Right to increase/decrease `beatsPerLoop`.

    > Even with bpm mode specified, you can still run exports. During export, loopkit will consult the `frames` property for how many frames it should render.

### beatsPerLoop

Current beatsPerLoop. Defaults to 1 and is not used unless you have specified bpm.

-   **Usage**:<br />
    See [`bpm`](#bpm) for full explanation.

### beat

Access to kit's Beat object. Not used, unless bpm is specified See [Beat](#Beat).

### name

Experiment name for exports.

-   **Usage**:<br />
    Used when generating out PNGs and the TAR archive, as well as for naming scripts in the archive. Handy when you are juggling several experiments.

### renderer

Access to PIXI.renderer. See [PIXI's documentation](http://pixijs.download/release/docs/PIXI.Renderer.html) for full details.

### bg

Current background color.

-   **Usage**:<br />
    Set to change the background color. Accepts any format that chroma.js supports. See [chroma.js reference](https://gka.github.io/chroma.js/#chroma) for details.

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
    Call this when loopkit is not running and you want to redraw a frame. Doesn't do anything if loopkit is running, so it's safe to run on key-strokes on any other input events.

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

-   **Usage**:<br />
    Pauses loopkit, and renderers all frames on top of each other.
-   **Arguments**:
    -   `{string} filename` - filename to export under. Should end with `.png`.
    -   `{float} opacity` - Opacity for each frame - controls how much next frames erase previous ones. Defaults to 0.2

### resize()

-   **Usage**:<br />
    Resizes loopkit to fit the container. Call if you have resized the container. By default elements like growing, but not shrinking so, to avoid that, you can set container's size explicitly and set `overflow: hidden` in CSS.

### destroy()

-   **Usage**:<br />
    Stops loopkit, removes any internal listeners, calls PIXI.js's cleanup functions, removes the canvas element and performs WebGL's context cleanup.

    > If you are running loopkit in a hot-reload environment, call the destroy function in the appropriate listener.

# Loop

Loop keeps track of the timeframe and offers a few helper functions that let you split the loop in smaller miniloops, control flow direction, and perform calculations with delays.

> Normally you'll be accessing loop through loopkit, via [`LoopKit.loop`](#loop)

### new Loop(frames)

-   **Arguments:**

    -   `{int} frames` - how many frames this loop will have. Can be changed on the fly later. Defaults to 120.

-   **Usage:**<br />
    Create a new instance of loop.

## Properties

### frame

Current frame in normalized (0..1) form.

### frameFull

Current frame in integer form. E.g if there are 60 frames, frameFull will go from 0..59.

### frames

Total frames for the loop. You can change it on the go, and loopkit will try to maintain roughly the same frame position at moment of the change.

### loops

How many loops have we run since starting up. You can use this value to expand your experiment beyond a single loop. For example, a motion could be deterministic within a loop, but you could add extra change on top based on how many times the loop has run.

# Methods

### tick(frames)

-   **Arguments:**

    -   `{int} frames` - Optional - by how many frames should the loop advance. Specify negative value to step backwards in time. Defaults to 1.

-   **Usage:**
    Use `tick()` to control the flow of the loop. Internally, loopkit calls `.tick()` on each render frame.

### delay(frames)

Returns `frame` value from N frames back (or ahead, if `frames` is negative).

> This function does not affect the loop itself, merely performs the calculations and returns the normalized value

-   **Arguments:**
    -   `{int} frames` - How many frames back (positive value) or ahead (negative value) are we going.
-   **Usage:**
    This will not affect the flow itself, but will return the normalized version of the frame if it would be delayed by N frames. This can be used to do draw ahead or behind the current frame to, for example, draw faded out outlines, or marking where the motion will go next.

*   **Example:**

    ```javascript
    let kit = new LoopKit(".kit.big", {
        frames: 120,
        bgColor: "#eee",
        onFrame: (g, frame) => {
            g.clear();
            let x = kit.width / 2;
            let y = kit.height / 2;

            // xOffset will move the circle back and forth using a sine function
            let xOffset = frame => Math.sin(frame * Math.PI * 2) * (kit.width / 4);
            let trail = 30;
            for (let i = 0; i <= trail; i++) {
                // center determines how close are we to the current frame (0..1)
                let center = 1 - i / trail;
                // Use opacity and thickness to fade out the trail
                g.lineStyle(center * 3, "#666", center);

                // Offset X by delay, and reduce the radius of the trailing circles
                g.drawCircle(x + xOffset(kit.loop.delay(i)), y, 20 + center * 100);
            }
        },
    });
    ```

    > The thing to note here is that our loop is fully deterministic, and after 120 frames it is back where it started!

### zig(times)

A helper function that splits the normalized 0..1 flow, into a see-saw motion, and returns `frame` from that situation.

-   **Arguments:**
    -   `{int} times` - How many times in the loop should we zig and zag back.
-   **Usage:**
    Over the lifecycle of a single loop, the `frame` value goes from 0 to 1. Zig allows to split this interval into several "zigs". At times=2, zig function, over the lifecycle of a single loop will go 0..1..0. At times=3, over the same interval it will go 0..1..0..1.
    This way you can have several back and forth motions in a single loop.

> This function does not affect the loop itself, merely performs the calculations and returns the normalized value.

> Tip: zig works really good in tandem with [Easing functions](#easing)!

### zigzag(times)

Calls `zig` x `times` x 2, and so will always reach 1 in the end. Think: boomerang.

### splitFrame(parts)

> This function does not affect the loop itself, merely performs the calculations and returns the normalized value

Splits frame into smaller buckets. So while frames goes 0..1, this will fill all the buckets one by one till all buckets are at 1. Here's an example of the buckets filling up over time:

| frame      | 0         | 0.2         | 0.4         | 0.6         | 0.8         | 1         |
| ---------- | --------- | ----------- | ----------- | ----------- | ----------- | --------- |
| `parts(2)` | [0, 0]    | [0.4, 0]    | [0.8, 0]    | [1, 0.2]    | [1, 0.6]    | [1, 1]    |
| `parts(3)` | [0, 0, 0] | [0.6, 0, 0] | [1, 0.2, 0] | [1, 0.8, 0] | [1, 1, 0.4] | [1, 1, 1] |

### fullCircle(callback)

Resets frame to 0 and runs through all frames, calling `callback` on each frame. Useful when you want to export all frames yourself.

# Graphics

The `Graphics` class is a thin wrapper around [PIXI.Graphics](http://pixijs.download/release/docs/PIXI.Graphics.html) that overrides `lineStyle` and `beginFill` functions to accept any color chroma.js supports. For details see [chroma.js reference](https://gka.github.io/chroma.js/#chroma).
Use this class instead of the Pixi's version when creating your own custom sprites

> Use the [LoopKit.graphics](#graphics) instance if you want to draw directly on the kit's surface, use the .

# Props

### Props({props})

-   **Usage:**<br />
    Props is the container for reactive properties. In it you can define inter-dependent properties that will be smartly cached and recalculated on demand

-   **Arguments:**

    -   `{Object} props` - a key:value dictionary of initial props

-   **Usage:**<br />
    Use props to manage all parameters of your experiment in a single place. Put anything you want to parametrize in the props.
    Props

-   **Example:**
    ```javascript
    let props = Props({
        // simple values
        x: 100,
        // dynamically calculated values, recalculated when dependencies change
        angle: state => scale(state.c3a, 0, 359, 0, 5),
        frames: state => scale(state.master, 300, 60, 60, 30),
        echo: state => scale(state.c2b, 0, state.frames - 1, 32),
    });
    ```

## Methods

### Props.addWatcher(callback)

-   **Arguments:**
    -   `{function} callback` - callback to call
-   **Usage:**<br />
    -   Add a `callback` that should get called every time any of the props change.

### Props.removeWatcher(callback)

-   **Arguments:**
    -   `{function} callback` - callback to call
-   **Usage:**<br />
    -   Remove previously added `callback` from the list of callbacks to call on change.

### Props.getState()

-   **Usage:**<br />
    -   Get current state of props. This returns values for all props.

### Props.loadState({values})

-   **Arguments:**
    -   `{object} values` - a {key:value} object with all the prop values that have to be set.
-   **Usage:**<br />
    -   Set values for all passed in props.

### Props.derived()
-   **Usage:**<br />
    -   Get all props that have been calculated (derived) rather have static values. The derived props quite often are the ones with the functional meaning. A "c1" prop might correspond to a state of a slider, while "waveLength" that uses c1 to calculate wavelength, is the one that has the real meaning for the user.

### scale(val, min, max, defaultVal, step)

-   **Arguments:**

    -   `{float} val` - normalized (0..1) value
    -   `{Number} min` - left side value of the scale, the one that will be returned when val == 0. Can be negative.
    -   `{Number} max` - right side value of the scale, the one that will be returned when val == 1. Can be negative.
    -   `{Number} defaultVal` - value to return when `val` is `Undefined`
    -   `{Number} step` - step that the return value should be rounded to. Can be floats, e.g. round to increments of 0.1, as well as ints, e.g. round to increments of 30

-   **Usage:**<br />
    Use `scale` to convert a normalized value into any range. Using scale in tandem with props allows to change the parameter ranges quickly, without having to look for the right spot burried in the code.

-   **Example:**

    ```javascript
    let props = Props({
        // dynamically calculated values, recalculated when dependencies change
        angle: state => scale(state.c3a, 0, 359, 0, 5),
        edges: state => scale(state.c1, 3, 200, 200) + scale(state.c1a, 0, 8),
        frames: state => scale(state.master, 300, 60, 60, 30),
        echo: state => scale(state.c2b, 0, state.frames - 1, 32),
    });
    ```

# Easing

Easing module contains all popular easing functions for quick conversion between a linear value and any of the easing ones.

### Easing.linear(t)

Returns the same value that was passed in.

-   **Usage:**<br />
    This function is handy when you need to temporarily turn easing off - easier to replace the easing function to linear, rather than rewriting the call.

### Standard easing functions

All of the functions below accept a normalized value t as input and return the translated value. For details on easing, see [What is easing?](/extra#what-is-easing) You can find graphs of all standard easing functions on https://easings.net/.

-   Sine: `Easing.sineIn`, `Easing.sineOut`, `Easing.sineInOut`
-   Quadratic: `Easing.quadIn`, `Easing.quadOut`, `Easing.quadInOut`
-   Cubic: `Easing.cubicIn`, `Easing.cubicOut`, `Easing.cubicInOut`
-   Quart: `Easing.quartIn`, `Easing.quartOut`, `Easing.quartInOut`
-   Quint: `Easing.quintIn`, `Easing.quintOut`, `Easing.quintInOut`
-   Exponential: `Easing.expoIn`, `Easing.expoOut`, `Easing.expoInOut`
-   Circular: `Easing.circIn`, `Easing.circOut`, `Easing.circInOut`
-   Back: `Easing.backIn`, `Easing.backOut`, `Easing.backInOut`
-   Elastic: `Easing.elasticIn`, `Easing.elasticOut`, `Easing.elasticInOut`
-   Bounce: `Easing.bounceIn`, `Easing.bounceOut`, `Easing.bounceInOut`

### Functions from material design

Functions snatched from [Material Design's motion chapter](https://material.io/design/motion/speed.html#easing)

-   `Easing.material`,
-   `Easing.materialDecelerated`,
-   `Easing.materialAcelerated`

### Easing.bezier(p1x, p1y, p2x, p2y)

-   **Usage:**<br />
    Roll your own easing function - takes in the bezier curve points and returns an easing function. Uses [BezierEasing](https://github.com/gre/bezier-easing#readme) module for it, so check out their docs.

-   **Example:**<br />
    ```javascript
    let materialAccelerated = BezierEasing(0.4, 0, 1, 1),
    ```

# RC

Use RC (short for Remote-ish Control) when you need to communicated two windows on the same machine rendering the same experiment.

-   **Usage:**<br />
    This can be useful if you are projecting one window to an external screen, but want to have a control interface in another.

*   **Example:**<br />

    RC works extra well in combination with Props, as you can broadcast result from [Props.getState](/props#propsgetstate) and then load it in the other windows using [Props.loadState](/props#propsloadstate)

    ```javascript
    const rc = new RC();

    window.addEventListener("keydown", evt => {
        if (evt.code == "ArrowRight") {
            props.bpm += 1;
        } else if (evt.code == "ArrowLeft") {
            props.bpm -= 1;
        }

        // we are sending kit's frame as well to make sure that the other window
        // renders the exact same thing we are rendering
        rc.send({frame: kit.frame, props: props.derived()});
    });

    function onRemoteVars(data) {
        kit.frame = data.frame;
        Object.entries(data.props).forEach(([prop, val]) => {
            props[prop] = val;
        });
        kit.render();
    }
    rc.addWatcher(onRemoteVars);

    // start listening
    rc.connect();
    ```

> Under the hood, RC uses [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) to locally communicate between windows of the same browser on the machine.

## Methods

### connect()

-   **Usage:**<br />
    Start listening to the local channel. The channel is locked to the browser path, so only windows with the same path will hear each other.

### send(data)

-   **Usage:**<br />
    Broadcast data to all listeners

### disconnect()

-   **Usage:**<br />
    Stop listening. Call this in your destruction procedure.

### addWatcher(callback)

-   **Arguments:**

    -   `{Function} callback` - gets called when a message has been received.

-   **Usage:**<br />
    Update local state from the received data.

### removeWatcher(callback)

-   **Arguments:**

    -   `{Function} callback` - callback that was previously passed into `addWatcher`

-   **Usage:**<br />
    Remove the callback from the list of callback to call when a new message comes in.

# Sound

When you want to react to sound
