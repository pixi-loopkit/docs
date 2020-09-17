---
title: Working with loops
order: 50
---

# Moving things around

Let's start with basic movement.
Hover over the square to start the animation!

```javascript
import {LoopKit} from "pixi-loopkit";

let kit = new LoopKit(".kit", {
    // default is 60 frames/loop, we're slowing down here
    frames: 120,
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        // clear canvas before we draw new stuff on it
        g.clear();
        g.lineStyle(2, "#333");

        // `frame` goes from 0..1, and the math below is telling
        // the square to go from 10 on the left to 10 on the right
        let x = 10 + frame * (kit.width - 100 - 20);
        g.drawRect(x, 100.5, 100, 100);
    },
});
```

The code above moves a square from left to right about 2 seconds, and then the animation starts over.
Here's how it works:

1. The refresh rate for PIXI animations is roughly  60fps (frames per second) - quite enough to create fluid animation. At 120 frames that we've specified, we have twice the time, thus two seconds. The framerate will drop if too much is going on and CPU/GPU is struggling.
1. If you don't specify, loopkit will assume 60 frames per loop. You can change that on init as well as on the fly!  You will be picking the exact frame count based on how quickly you want your thing to animate, and also, if that's your goal,  taking into consideration the size of the resulting animated GIF.
1. The `frame` variable that gets passed into the `onFrame` callback is a normalized value that goes from 0 to 1, regardless of how many frames our loop has. So, for example, if our loop is 60 frames, 0 will correspond to the first frame, and 1 will correspond to the 59th frame (60th frame is the first frame of the next loop).
1. The first param, `g`, is just a pointer to `kit.graphics` - so you can do your drawing straight onto kit.

# A continuous loop!

Now, wouldn't it be fun if the square would not jerk back to the beginning at the start of the next iteration?

```javascript
import {LoopKit} from "pixi-loopkit";

let kit = new LoopKit(".kit", {
    bgColor: "#666",
    frames: 120,
    onFrame: (g, frame) => {
        g.clear();

        // Just setting our square size here to simplify thinking
        let size = 100;
        let middle = (kit.width - size) / 2;

        // `frame` goes from 0..1, and the math below is telling
        // the square to go from the middle of canvas to middle of
        // the next canvas, if there would be one on the right.
        let x = middle + frame * kit.width;

        // beginFill is when you want to fill things instead of drawing lines
        // you can do both, of course!
        g.beginFill("#eee");
        g.drawRect(x, 100, size, size);

        // we've sneakily added another square, exactly canvas-width behind
        g.drawRect(x - kit.width, 100, 100, size, size);

        g.endFill();
    },
});
```

Without reading the code, one might thing we are following an infinite flow of squares sliding to the right, while in actuality, it's just 2 squares jumping back to their initial positions at the beginning of the next iteration!

The example above is one way of establishing continuity. Let's look at another one.

### Continuous looping - simple rotation

Let's consider our square - since it has four sides, for us to establish a continuous loop, we'd just need to turn it 90 degrees.

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";

// We will use an object as we want make use of rotation. We could do
// the math ourselves (and later we will), but let's keep it simple for now.
class Square extends Graphics {
    constructor() {
        // call super so it initializes all its bits
        super();
        this.size = 100;
        let half = this.size / 2;

        // we are drawing the rectangle so that the object anchor, the
        // (0,0) coordinate for this graphic, is smack middle of the square
        this.moveTo(-half, -half); // upper left

        // we will paint each edge in a different color, so we can
        // better see what's going on
        this.lineStyle(5, "red");
        this.lineTo(half, -half); // upper left->right

        this.lineStyle(5, "blue");
        this.lineTo(half, half); // upper right -> lower right

        this.lineStyle(5, "green");
        this.lineTo(-half, half); // lower right -> lower left

        this.lineStyle(5, "black");
        this.lineTo(-half, -half); // closing up
    }
}

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        [rect.x, rect.y] = [kit.width / 2, kit.height / 2];

        // instead of incrementing the angle ad infinitum, we are
        // deterministically setting it to go from (0..1) * 90
        // which means it will go from 0 to 90. exactly what we want
        rect.angle = frame * 90;
    },
});

// Creating the squares we are changing above, and adding them to the kit
let rect = new Square(150);
kit.addChild(rect);
```

If not for the colors resetting back to their previous values, the motion once again looks continuous (magic!)

> Here's another keyboard shortcut: if you click into the square and pause it (you can pause/unpause with the Spacebar),
using Left/Right arrows will go between frames, 10 at a time. Shift+Left/Right will move one frame at a time. Try to find the exact spot where the loop ends (hint, at fram 0 the top edge is red).

> Also try hitting the R button - pretty cool what a simple square can do, eh?


### Chasing siblings

When considering motion, another way to establish continuity in a homogeneous (e.g. regularly spaced out elements) environment, is to just try and chase our siblings.

(expand me with 4 squares chasing each other)

# Normalization (0..1)

If you are no stranger to working with normalized values, you can safely skip this section. If you are still not sure how to convert a `-50..300` range into `0..1`, read on!

Normalized ranges crop up anywhere because they allow you to go from any scale to any other scale. In essence, a normalized range is a sort of gradient between a thing A and a thing B.

A and B could be two locations (like a cafeteria and your home), or they could be colors (say, red and blue). They could be sizes, or anything else

We are creating a hybrid between A and B, so that at zero, we are 100 percent A and 0 percent B, and at 1, it's the opposite - 100% B and 0% A.


| What     | 0         | 0.5             | 1         |
|----------|-----------|-----------------|-----------|
| location | home      | half way there! | cafeteria |
| color    | red       | violet          | blue      |
| elevator | 3rd floor | 5th floor       | 7th floor |

The math to get from anything to anything is actually pretty straight forward.

Our magical slider (e.g. `frame`) goes from 0 to 1, so here's what we do:

```
val = A * (1 - frame) + B * frame
```

Let's see how that works out if we put in real numbers. Let's say our A is -50, and our B is 270.


| frame | A          | B          | result |
|-------|------------|------------|--------|
| 0     | -50 \* 1   | 270 \* 0   | -50    |
| 0.2   | -50 \* 0.8 | 270 \* 0.2 | 14     |
| 0.4   | -50 \* 0.6 | 270 \* 0.4 | 78     |
| 0.6   | -50 \* 0.4 | 270 \* 0.6 | 142    |
| 0.8   | -50 \* 0.2 | 270 \* 0.2 | 44     |
| 1     | -50 \* 0   | 270 \* 1   | 270    |


> Here the A and B were simple integers, but you could do the same with coordinates (you'd interpolate A.x -> B.x and A.y -> B.y), or colors (colors can be expressed as Red-Green-Blue or, even better, Hue-Saturation-Lightness; luckily chroma does all the color blending for us, so we don't have to).

In essence though, when you think about normalized values, the 0 means "all of the first thing and none of the second thing", and at 1 we are at "all of the second thing and none of the first thing".

What we looked at above is called "linear interpolation", meaning that we are moving at an equal speed from A to B. There is more fun to be had though when we pull in easing!