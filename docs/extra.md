---
title: Extra
order: 1000
---

# Thinking in normalized values (0..1)

Normalized ranges crop up everywhere because they allow to go from any scale to any other scale. It's like a gradient of sorts between a thing A and a thing B. The two things could be locations (like a cafeteria and your home), or they could be colors (say, red and blue), or they could be sizes, or anything else.

In a normalized range, we always end up with a decimal number between 0 and 1. When we normalize, we are creating a hybrid between A and B so that at zero we are 100 percent A and 0 percent B, and at one, it's the opposite - 100% B and 0% A. Here are a few examples of things transitioning between one end and the other.

| What                    | 0         | 0.5             | 1         |
| ----------------------- | --------- | --------------- | --------- |
| **going to a cafe**     | home      | half way there! | cafeteria |
| **mixing red and blue** | red       | violet          | blue      |
| **taking an elevator**  | 3rd floor | 5th floor       | 7th floor |

The basic math to get from anything to the other thing (called "interpolation") looks like this:

```
val = A * (1 - frame) + B * frame
```

In the beginning our frame is 0, and so we end up being 100% A. As the frame value goes from zero to one, the values become less and less A and more and more B.

Hope you're still with us! Let's see how that works out if we put in real numbers. Let's say our A is -50, as in negative 50 celsius (that's awfully cold), and our B is 270 (super hot owen; probably too hot). Now we will try to get from A to B in five steps (0 -> 20% -> 40% -> 60% -> 80% -> 100%)

| frame | A               | B               | result |
| ----- | --------------- | --------------- | ------ |
| 0     | -50 × 1 = -50   | 270 × 0 = 0     | -50    |
| 0.2   | -50 × 0.8 = -40 | 270 × 0.2 = 54  | 14     |
| 0.4   | -50 × 0.6 = -30 | 270 × 0.4 = 108 | 78     |
| 0.6   | -50 × 0.4 = -20 | 270 × 0.6 = 162 | 142    |
| 0.8   | -50 × 0.2 = -10 | 270 × 0.8 = 216 | 206    |
| 1     | -50 × 0 = 0     | 270 × 1 = 270   | 270    |

_Et voilà_, we have ourselves a working imaginary owen!

> Here the A and B are simple integers, but you could do the same with coordinates (you'd interpolate A.x -> B.x and A.y -> B.y), or colors (colors can be expressed as Red-Green-Blue or, even better, Hue-Saturation-Lightness; luckily [chroma does all the color blending for us](https://gka.github.io/chroma.js/#chroma-blend), so we don't have to worry about it; more on that later!).

In essence, when you think about normalized values, the 0 is "all of the first thing and none of the second thing", and at 1 we it is "all of the second thing and none of the first thing". The reason why normalized ranges are so handy is because you can express any transition using it!

For loopkit, the number one place we'll find a normalized value is the `frame` variable you receive in the `onFrame` callback. 0 means "beginning of the loop", and the value will keep growing with each frame, till it reaches 1 and resets. If the loop has 60 frames, the number would increase by 1/60th each time. We don't have to worry about the exact value though, as we just keep the "all of A and none of B" and `frame` tells us how much of the one and not the other we want in this frame, exactly.

# What is easing?

In the section above we look at expressing any range into 0..1. Then we split our normalized scale in equal parts and proceed going from A to B at a constant pace. That is called "linear interpolation". And it looks like the example on the right - the red ball is moving (don't forget to mouse over!) along the x axis with each frame, and the y coordinate half way in the loop is at 50 percent. You might also see where they got the "linear" in "linear interpolation" - it's a line!

```javascript
import {LoopKit} from "pixi-loopkit";

let getY = frame => {
    // the Y coordinate goes from 0..100, we just center it
    // vertically with `height / 2 + 50`
    return kit.height / 2 + 50 - frame * 100;
};

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        g.clear();

        // draw ball's trajectory in grey
        g.beginFill("#ccc");
        for (let i = 0; i < 1; i += 1 / 60) {
            g.drawCircle(i * kit.width, getY(i), 3);
        }
        g.endFill();

        // draw crosshairs so it's easier to spot the middle
        g.lineStyle(1, "#888");
        g.moveTo(0, kit.height / 2 + 0.5);
        g.lineTo(kit.width, kit.height / 2 + 0.5);
        g.moveTo(kit.width / 2 + 0.5, 0);
        g.lineTo(kit.width / 2 + 0.5, kit.height);

        // the red ball; we have to reset line to invisible
        g.lineStyle(0);
        g.beginFill("red");
        g.drawCircle(frame * kit.width, getY(frame), 5);
        g.endFill();
    },
});
```

While a totally solid way for getting from A to B, things in nature rarely have linear trajectories and so the motion does look, for a lack of better term, very computery. In nature, thanks to to gravity, friction, and inertia, we have swinging changes in speed.

The code below is the exact copy of the code above, with just a tiny tweak in the getY function. Despite the fact that we are still getting from A to B in the same time, the way how it happens is quite different!

```javascript
import {LoopKit} from "pixi-loopkit";

let getY = frame => {
    // We apply cubic-in-out interpolation to our 0..1 frame.
    // It will cause it to start up slow, do a quick shift around
    // middle to the other side, and then slowly aim towards 1
    frame = Easing.cubicInOut(frame);
    return kit.height / 2 + 50 - frame * 100;
};

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        g.clear();

        // draw ball's trajectory in grey
        g.beginFill("#ccc");
        for (let i = 0; i < 1; i += 1 / 60) {
            g.drawCircle(i * kit.width, getY(i), 3);
        }
        g.endFill();

        // draw crosshairs so it's easier to spot the middle
        g.lineStyle(1, "#888");
        g.moveTo(0, kit.height / 2 + 0.5);
        g.lineTo(kit.width, kit.height / 2 + 0.5);
        g.moveTo(kit.width / 2 + 0.5, 0);
        g.lineTo(kit.width / 2 + 0.5, kit.height);

        // the red ball; we have to reset line to invisible
        g.lineStyle(0);
        g.beginFill("red");
        g.drawCircle(frame * kit.width, getY(frame), 5);
        g.endFill();
    },
});
```

> You don't have to pay attention to the exact math going on in easing. Knowing that if you wrap the frame with this or that easing function will give you a more natural feeling is quite sufficient. In loopkit you also don't have to worry about easing the position - we can ease the frame itself, instead. In practice it amounts to exactly the same, but is easier to think about!

It might feel a bit like magic, but don't shy away, let's, just for a second, look at the numbers together! The `cubicInOut` function is essentally a convertor with a preference - you give it one number, and it returns you what it thinks of it, and it prefers to hang around the edges (just like we can see in the graph above). In the table below we've rounded the numbers down to significant digits, so it's not exactly precise, but check out how at 20% in the frame (0.2), the cubicInOut is still saying "Nah, we're just 3% in", and then it starts picking up speed, runs past the center (half matches prefectly), and at 70% (0.7) it's already saying, "I feel like we're roughly 90% done with this."

| value      | 0   | 0.1   | 0.2  | 0.3 | 0.4  | 0.5 | 0.6  | 0.7  | 0.8  | 0.9  | 1   |
| ---------- | --- | ----- | ---- | --- | ---- | --- | ---- | ---- | ---- | ---- | --- |
| cubicInOut | 0   | 0.004 | 0.03 | 0.1 | 0.26 | 0.5 | 0.74 | 0.89 | 0.97 | 0.99 | 1   |

The `cubic` part of the function name comes from the fact that it does the frame to the power of three, or cube. There is also quad for 2^, quart for 4^, and quint for 5^. The general shape for all of these is pretty much the same, just the higher it goes, the more pronounced the bias becomes.

There are number of popular easing functions, and you can look at their motion on [easings.net](https://easings.net/). Loopkit supports all the well known ones, plus the two easing formulas from google's material design that aim to provide a natural-looking feel to motion.

Let's look at a few easing algorithms side-by-side. We will skip the X axis and move the circles vertically.

```javascript
import {LoopKit} from "pixi-loopkit";
let getY = (frame, func) => {
    return kit.height / 2 - 100 + func(frame) * 200;
};

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    frames: 90,
    onFrame: (g, frame) => {
        g.clear();

        g.beginFill("#999");
        g.drawCircle(50, getY(frame, Easing.linear), 10);

        g.beginFill("blue");
        g.drawCircle(100, getY(frame, Easing.expoInOut), 10);

        g.beginFill("red");
        g.drawCircle(150, getY(frame, Easing.backOut), 10);

        g.beginFill("green");
        g.drawCircle(200, getY(frame, Easing.bounceOut), 10);

        g.beginFill("magenta");
        g.drawCircle(250, getY(frame, Easing.elasticOut), 10);

        g.endFill();
    },
});
```

We've picked some of the more playful ones, but each easing algorithm has its uses. `bounceOut` and `elasticOut` on the right side have both very fitting names. `expoOut` (second from left) is good for when you want to scooch real fast, and using in-out variant like here still gives us the smooth operator that it is.

> Don't forget you can pause the motion and use Shift+Left and Shift+Right to go back and forth in time! Also, try out pressing R to see the stills version of this experiment!

Also, note how both, `backOut` in the middle, and `elasticOut` on the right overshot the target - they actually can be bigger than 1 (that might sometimes lead to unexpected consequences, but if your loop is continuous, most of the time will do exactly what you'd expect).

If you'd like to learn more about easing, try running a web search for "easing functions". To be honest there aren't many quality articles on the topic. What also might be helpful, is that the original functions were written by Robert Penner. [His website](http://robertpenner.com/easing/) has a couple of links for further digging.
