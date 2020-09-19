---
title: Reactive Properties
order: 100
---

# At a glance

A large part of creating stuff is the joy of switching away from the coding mode and into experimentation, where playfullness comes in and anything goes. It's making something and then thinking "I wonder what if..." and then quickly making it happen and seeing it in action. This is where reactive properties come in. They allow to keep your code sane.

This first example is somewhat contrived, but try clicking into the square and use Left/Right arrow buttons to move around. You will notice that line width changes with the x position of the square. The `lineWidth` in the example is recalculated only when the properties it depends on change - thus reactive properties!

```javascript
import {LoopKit, Props} from "pixi-loopkit";
let props = Props({
    // properties can be simple values, like x here
    x: 150,

    // or they can be functions that depend on other props or external constants
    lineWidth: state => state.x / 5,
});

props.addWatcher((prop, val, prev) => {
    // addWatcher notifies whenever any of the props change
    // check the dev console!
    console.log(prop, "has changed:", prev, "->", val);
});

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        g.clear();
        g.lineStyle(props.lineWidth, "#666");
        g.drawRect(props.x - 50, 100, 100, 100);
    },
});

kit.canvas.addEventListener("keydown", evt => {
    if (evt.key == "ArrowLeft") {
        props.x = Math.max(props.x - 10, 10);
    } else if (evt.key == "ArrowRight") {
        props.x = Math.min(props.x + 10, kit.width - 10);
    }
});
```

## What's going on

You could modify the properties in many ways - you might choose to react to mouse actions, taps, microphone, a MIDI controller, or the accelerometer readings on the phone. When using props, everything will boil down to simple, flat props access that you can reference in your code. Being able to create props that depend on other props (that is, reactive props) allows to create complex relationships between the attributes.

# Real life example

To gain a better understanding, let's look at a [live example here](https://tomstriker.org/x/ripple/ripple3/). Open it up and try pressing the numbers 1 to 5 on the keyboard. It will switch between different configurations. The props will show up in the top left corner. Note: clicking pauses the thing, you can resume by clicking again, or by pressing the Space bar. Heres the actual prop code:

```javascript
import {LoopKit, Props, scale} from "pixi-loopkit";
let props = Props({
    // `scale` functions signature is scale(norm, min, max, default, step)
    // which allows you to convert 0..1 to any range
    edges: state => scale(state.c1, 3, 200, 200) + scale(state.c1a, 0, 8),
    ripples: state => scale(state.c1b, 1, maxRipples, 20),

    subwaves: state => scale(state.c2, 0, 20, 7),
    waveHeight: state => scale(state.c2a, 0, 200, 40),
    echo: state => scale(state.c2b, 0, state.frames - 1, 32),

    zoom: state => scale(state.c3, 0.1, 5, 0.64),
    angle: state => scale(state.c3a, 0, 359, 0, 5),

    frames: state => scale(state.master, 300, 60, 60, 30),

    colorFrom: state => scale(state.c4, 0, 359),
    colorTo: state => scale(state.c4a, 0, 359),
    colorFrameVariation: state => scale(state.c5a, 0, 359),

    spin: state => 1,
});

// the props code above is referring to `c1`, `c1b`, `c2` and so on
// here's where those values come from: a midi controller
// that sends an event whenever the user turns a dial
// in this case the event data would be something like {code: "c1", val: 0.7}
midi.addEventListener("cc", data => {
    props[data.code] = data.val;
});
```
