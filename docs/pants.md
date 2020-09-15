---
title: My pants are too big
slug: pants
---

Markdown content is markdowning

```javascript
import {LoopKit, Graphics} from "pixi-loopkit";
let kit = new LoopKit(".kit", {
    bgColor: "#eee",
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
    bgColor: "#eee",
    onFrame: () => {
        rect.rotation += 0.01;
    },
});

let rect = new Square(100, 100, 100, 100);
kit.addChild(rect);
```
