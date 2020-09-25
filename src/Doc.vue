<script>
    export default {
        metaInfo() {
            return {
                title: this.doc.title,
                meta: [{key: "description", name: "description", content: this.doc.description}],
            };
        },
        data() {
            return {
                demos: [],
                scripts: [],
            };
        },

        computed: {
            doc: state => state.$context.doc,
            content: state => state.doc.content,
        },

        methods: {
            initDemos() {
                window.PIXI = require("pixi.js");
                window.demos = this.demos;
                // make all loopkit object accessible on the top level, so that our fake
                // `import {Banaan} from "pixi-loopkit"` imports in source work without importing
                let loopkit = require("pixi-loopkit");
                Object.assign(window, loopkit);

                document.querySelectorAll("pre.language-javascript").forEach(pre => {
                    let source = pre.textContent;
                    if (pre.parentElement.classList.contains("live-code")) {
                        // we're already wrapped
                        return;
                    }
                    if (!source.match(/\.kit/g)) {
                        // not kit - nothing to do!
                        return;
                    } else {
                        let lines = source.split(/\n/g);
                        // filter out imports as those are allowed only in modules
                        lines = lines.filter(line => line.indexOf("import") != 0);
                        source = lines.join("\n");
                    }

                    let container = document.createElement("div");
                    container.classList.add("live-code");

                    let demoBox = document.createElement("div");
                    demoBox.classList.add("demo");
                    let id = Math.round(Math.random() * 999999).toString(36);
                    demoBox.classList.add(`demo-${id}`);

                    if (source.indexOf(".kit.big") != -1) {
                        container.classList.add("big");
                    }

                    pre.replaceWith(container);
                    container.appendChild(demoBox);
                    container.appendChild(pre);

                    // point our universal kit, to uniquely generated random hash
                    source = source.replace(/"\.kit"/g, `".demo-${id}"`);
                    source = source.replace(/"\.kit.big"/g, `".demo-${id}"`);

                    // add our local magic for usable demos
                    source = `
                                function demo${id}() {
                                    ${source}
                                    kit.stop();
                                    let engaged = false;
                                    kit.canvas.addEventListener("mouseover", () => {if (!engaged) { kit.start()}});
                                    kit.canvas.addEventListener("mousedown", () => {
                                        engaged = true;
                                        kit.ticker.started ? kit.stop() : kit.start();
                                    });

                                    // push into global so that we can destroy them properly once done
                                    window.demos.push(kit);
                                }
                                demo${id}();
                            `;
                    let script = document.createElement("script");
                    script.innerHTML = source;
                    document.body.appendChild(script);
                    this.scripts.push(script);
                });
            },

            cleanup() {
                this.demos.forEach(kit => {
                    // can has cleanup
                    kit.destroy();
                });
                this.demos = [];
                this.scripts.forEach(script => {
                    document.body.removeChild(script);
                });
                this.scripts = [];
            },
        },

        watch: {
            content(content) {
                this.$nextTick(() => {
                    this.cleanup();
                    this.initDemos();
                });
            },
        },

        mounted() {
            this.initDemos();
        },

        beforeDestroy() {
            this.cleanup();
        },
    };
</script>


<template>
    <Layout>
        <article>
            <header class="page-header">{{ doc.title }}</header>
            <div v-html="doc.content" />
        </article>
    </Layout>
</template>


<style lang="scss">
    .live-code {
        margin: 2em 0;
        position: relative;

        .demo {
            position: absolute;
            top: 0;
            right: 0;
            height: 300px;
            width: 300px;
            border: none;
            border-radius: 10px;
            user-select: none;
            overflow: hidden;

            canvas:focus {
                outline: none;
                // box-shadow: 0 0 0px 3px white, 0 0 0px 5px #aaa;
            }
        }

        &.big {
            display: flex;
            flex-direction: column-reverse;
            .demo {
                position: relative;
                width: 100%;
                margin-top: 1em;
            }
        }
    }
</style>
