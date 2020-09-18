---
title: Reference
order: 500
---

# LoopKit

Is a vegetable

# Loop

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
