<static-query>
query Menu {
  nodes: allDoc {
    edges {
      node {
        path
        slug
        title
        order
        headings {
          value
          anchor
          depth
        }
      }
    }
  }
}

</static-query>

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
                sections: [],
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
                                                    let onPointer = () => {
                                                        engaged = true;
                                                        kit.ticker.started ? kit.stop() : kit.start();
                                                    }
                                                    kit.canvas.addEventListener("mousedown", onPointer);
                                                    kit.canvas.addEventListener("pointerdown", onPointer);

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

            this.$static.nodes.edges.forEach(node => {
                let doc = node.node;
                let leaf = doc.path.split("/").slice(-2, -1)[0];
                doc.slug = doc.slug || leaf;

                let headings = [];
                doc.headings.forEach(heading => {
                    if (heading.depth == 1) {
                        headings.push({
                            title: heading.value,
                            path: `/${doc.slug}${heading.anchor}`,
                        });
                    }
                });
                this.sections.push({
                    order: doc.order,
                    title: doc.title,
                    slug: doc.slug,
                    link: headings[0].path,
                });
            });

            this.sections.sort((a, b) => a.order - b.order);
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

            <footer>
                <nav>
                    <g-link v-for="section in sections" :key="section.slug" :to="section.link.split('#')[0]">
                        {{ section.title }}
                    </g-link>
                </nav>

                <p>
                    Caught a mistake or want to contribute to the documentation?
                    <a :href="`https://github.com/pixi-loopkit/docs/tree/master/docs/${doc.leaf}.md`">
                        Edit this on GitHub!
                    </a>
                </p>
                <p>Deployed on <a href="https://www.netlify.com/">Netlify</a>.</p>
            </footer>
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

    footer {
        nav {
            display: none;
            border-bottom: 1px solid #aed9e0;
            padding-bottom: 1em;
            margin-bottom: 2em;
            text-align: center;

            a {
                display: inline-block;
                padding: 5px;
                text-transform: uppercase;
                white-space: nowrap;
            }
        }

        @media (max-width: 750px) {
            text-align: center;
            nav {
                display: block;
                padding-left: 2em;
                padding-right: 2em;
            }
            p {
                padding: 0 2em;
            }
        }
    }
</style>
