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

The code above moves the square from left to right in about 2 seconds and then the animation starts over.
Here's how it works:

1. The redraw rate is roughly 60fps (frames per second) - good enough to create a fluid animation. At 120 frames that we've specified, we have twice the time, thus two seconds.
1. By default loopkit assumes 60 frames per loop, but you can change that on init as well as on the fly! You will be picking the exact frame count based on how quickly you want your thing to animate, and also, if that's your goal, taking into consideration the size of the resulting GIF.
1. The first param, `g`, is just a pointer to `kit.graphics` so that you can do your drawing straight onto the canvas.
1. The second param `frame` is a normalized value that always goes from 0 to 1 regardless of how many frames our loop has. So, for example, if our loop is 60 frames, 0 will correspond to the first frame, and 1 will correspond to the 59th frame (60th frame is the first frame of the next loop).

# A continuous loop

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

        // we're sneakily drawing another square, exactly canvas-width behind
        g.drawRect(x - kit.width, 100, 100, size, size);

        g.endFill();
    },
});
```

Without reading the code, one might think we are following an infinite flow of squares sliding to the right, while in actuality, it's just 2 squares jumping back to their initial positions at the beginning of the next iteration!

The example above is one way of establishing continuity. Let's look at another one.

## Making use of radial symmetry

Let's consider our square - since it has four sides, for us to establish a continuous loop, we'd just need to turn it 90 degrees.

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";

// We will use an object as we want make use of rotation. We could do
// the math ourselves (and later we will), but let's keep it simple for now.
class Square extends Graphics {
    constructor() {
        super();
        this.size = 100;
        let half = this.size / 2;

        // We are drawing the rectangle so that the object anchor, the
        // (0,0) coordinate for this graphic, is smack middle of the square
        this.moveTo(-half, -half); // upper left

        // We will paint each edge in a different color, so we can
        // better see what's going on
        this.lineStyle(5, "red");
        this.lineTo(half, -half); // top edge

        this.lineStyle(5, "blue");
        this.lineTo(half, half); // right edge

        this.lineStyle(5, "green");
        this.lineTo(-half, half); // bottom edge

        this.lineStyle(5, "black");
        this.lineTo(-half, -half); // left edge
    }
}

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        // center the square
        [rect.x, rect.y] = [kit.width / 2, kit.height / 2];

        // Instead of incrementing the angle ad infinitum, we are
        // deterministically setting it to go from (0..1) * 90
        // which means it will go from 0 to 90. Exactly what we want!
        rect.angle = frame * 90;
    },
});

let rect = new Square(150);
kit.addChild(rect);
```

If not for the colors resetting back to their previous values, the motion once again looks continuous.

> Here's another keyboard shortcut: if you click into the square and pause it (you can pause/unpause with the Spacebar),
> using Left/Right arrows will go between frames, 10 at a time. Shift+Left/Right will move one frame at a time. Try to find the exact spot where the loop ends (hint, at the frame 0 the top edge is red).

> Also try hitting the R button - pretty cool what a simple square can do!

## Making use of normalization to chase siblings

> Normalized values is where you convert any arbitrary range to 0..1 interval. Check out [thinking in normalized values](/extra) if the concept is new to you!

So let's use that sweet interpolation to get our squares chase their siblings.
In the example below, each square is trying to get to the position of the next element in the list (and the last one aims for the first). The squares have been laid out clockwise, starting at top-left.

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";

class Square extends Graphics {
    constructor(x, y, size = 50) {
        super();

        // Set the coordinates, but also store them separately
        // as "original". See the onFrame below for for why!
        [this.x, this.y] = [x, y];
        [this.origX, this.origY] = [x, y];
        this.beginFill("#aaa");
        this.drawRect(-size / 2, -size / 2, size, size);
    }
}

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        rectangles.forEach((rectangle, idx) => {
            // find our next sibling. the modulus makes sure that once we
            // reach last element, we wrap around to first
            let next = rectangles[(idx + 1) % rectangles.length];

            // rectangle's position goes from its original to the original
            // position of the next one as our frame goes 0..1
            rectangle.x = rectangle.origX * (1 - frame) + next.origX * frame;
            rectangle.y = rectangle.origY * (1 - frame) + next.origY * frame;
        });
    },
});

// We place the 4 rectangles clockwise. Normally you wouldn't hard-code
// the coordinates like this, but we are just keeping things simple for now.
let rectangles = [new Square(75, 75), new Square(225, 75), new Square(225, 225), new Square(75, 225)];
kit.addChild(...rectangles);
```

## Adding easing for a more dynamic feel

The movement above looks quite mechanical, doesn't it? The motion we have above is called "linear interpolation", meaning that we are moving from A to B at a steady, constant pace. Let's spiff it up by adding some easing to it!

> If you are unfamiliar with easing or could use a quick refresher, check out ["What is easing?"](http://localhost:8080/extra#what-is-easing)

```javascript
import {LoopKit, Graphics, Easing} from "pixi-loopkit";

class Square extends Graphics {
    constructor(x, y, size = 50) {
        super();
        [this.x, this.y] = [x, y];
        [this.origX, this.origY] = [x, y];
        this.beginFill("#aaa");
        this.drawRect(-size / 2, -size / 2, size, size);
    }
}

let kit = new LoopKit(".kit", {
    bgColor: "#fafafa",
    onFrame: (g, frame) => {
        rectangles.forEach((rectangle, idx) => {
            // We are doing two things here:
            // first we are applying expoInOut to the motion to
            // make it perform exaggerated sweeps.
            // Second, we are adding a bit of delay for each square
            // to give it a sense of playful chaos/catch-up.
            let actionFrame = Easing.expoInOut(frame - idx / 12);

            // the rest is the same, except we use `actionFrame` to determine the position
            let next = rectangles[(idx + 1) % rectangles.length];
            rectangle.x = rectangle.origX * (1 - actionFrame) + next.origX * actionFrame;
            rectangle.y = rectangle.origY * (1 - actionFrame) + next.origY * actionFrame;
        });
    },
});
let rectangles = [new Square(75, 75), new Square(225, 75), new Square(225, 225), new Square(75, 225)];
kit.addChild(...rectangles);
```

Not sure if this is much better, but it definitely is something! Playing with different easing alghorithms can lead to very different results for the movement. The main takeaway here, though, is that you can alter any motion in the loop by using easing functions on the frame itself!

We went over a few simple tricks how to close up the loop. Ultimately, figuring out the exact way how you want to loop is part of making your thing. So go out there and get cracking!

[Onwards to "Reactive properties"](/props)
