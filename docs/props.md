---
title: Reactive Properties
order: 100
---

# At a glance

> NOTE: This section is still in works. Apologies for the mess!

A large part of creating experimental stuff is the joy of switching away from the coding mode and into experimentation, where play comes in and anything goes. It's making something and then thinking "I wonder what if..." and then quickly making it happen and seeing it in action. This is where reactive properties come in: they allow you to keep the code sane while experimenting with the values.

This first example is somewhat contrived, but try clicking into the square and use Left/Right arrow buttons to move around. You will notice that line width changes with the x position of the square.

```javascript
import {LoopKit, Props} from "pixi-loopkit";
let props = Props({
    // Properties can be simple values, like the x here, or calculations
    // that may depend on other props, like the lineWidth below it.
    lineWidth: state => state.mouseX / 5 + 2,
});

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        props.kitW = kit.width;
        g.clear();
        g.lineStyle(props.lineWidth, "#666");
        g.drawRect(100, 100, 100, 100);
    },
});

kit.canvas.addEventListener("mousemove", evt => {
    props.mouseX = evt.offsetX;
});
```

## The Model

The pattern to follow is to let props know about all relevant input. Be it mouse position, microphone volume, state of MIDI dials, or the state of the phone's accelerometer. Then you use those input values to derive whatever params you want in whichever order, and then you can use them on the kit.

It doesn't have to be just input properties of course. Anything that could be described as a parameter for your visualization belongs there too, derived or no!

A really useful helper to props is the `scale` function.

# Props + `scale`

Let's redo our example from before. If you re-read the code - the line width was set to be 1/5th of mouse position. Controlling that value is rather cumbersome.


```javascript
import {LoopKit, Props, scale} from "pixi-loopkit";
let props = Props({
    // Scale's params are (norm, min, max, [step, [default]])
    // min doesn't necessarily have to be smaller than max
    // invert the scale by putting the larger value as min
    lineWidth: state => scale(state.mouseNorm, 20, 100),
});

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        g.clear();
        g.lineStyle(props.lineWidth, "#666");
        g.drawRect(50, 50, 200, 200);
    },
});

kit.canvas.addEventListener("mousemove", evt => {
    console.log(evt);
    props.mouseNorm = evt.offsetX / kit.width;
});
```

