
<script>
    let app;
    if (!process.isClient) {
        app = {
            metaInfo: {
                title: "Demo",
            },
        };
    } else {
        let PIXI = require("pixi.js");
        let PixiLoopkit = require("pixi-loopkit");
        let dependencies = {...PixiLoopkit};
        dependencies["PIXI"] = PIXI;

        PIXI.utils.skipHello();

        app = {
            metaInfo: {
                title: "Demo",
            },

            mounted() {
                let lines = decodeURIComponent(document.location.href.split("?")[1]);
                lines = atob(lines).split(/\n/g);
                lines = lines.filter(line => line.indexOf("import") != 0);
                let source = "";
                Object.entries(dependencies).forEach(([key, val]) => {
                    source += `let ${key} = dependencies['${key}'];\n`;
                });
                source += lines.join("\n");
                eval(source);
            },
        };
    }

    export default app;
</script>

<template>
    <div class="kit"></div>
</template>

<style>
    body {
        overflow: hidden;
    }
    .kit {
        overflow: hidden;
        height: 300px;
        width: 100%;
    }
</style>
