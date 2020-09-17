<script>
    export default {
        metaInfo() {
            return {
                title: this.doc.title,
                meta: [{key: "description", name: "description", content: this.doc.description}],
            };
        },

        computed: {
            doc: state => state.$context.doc,
        },

        methods: {
            initDemos() {
                document.querySelectorAll("pre.language-javascript").forEach(pre => {
                    if (pre.parentElement.classList.contains("live-code")) {
                        // we're already wrapped
                        return;
                    }

                    let source = pre.textContent;
                    let container = document.createElement("div");
                    container.classList.add("live-code");
                    let iframe = document.createElement("iframe");
                    let toBase = encodeURIComponent(btoa(source));
                    iframe.setAttribute("src", `/demo?${toBase}`);

                    pre.replaceWith(container);
                    container.appendChild(pre);
                    container.appendChild(iframe);
                });
            },
        },

        watch: {
            $context(page) {
                window.setTimeout(() => {
                    this.initDemos();
                }, 10);
            },
        },

        mounted() {
            this.initDemos();
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
    $max-width: 1200px;
    $nav-width: 180px;

    article {
        max-width: $max-width;
        margin: 0 auto;
        padding-left: $nav-width + 30px;
        padding-top: 30px;
        padding-right: 20px;
        color: #333;
        margin-bottom: 50px;

        p,
        ul,
        ol {
            line-height: 150%;
            max-width: 45em;
        }

        h1:not(:first-child) {
            padding-top: 50px;
        }

        h1 {
            font-size: 2em;
        }

        h2 {
            font-size: 1.5em;
            margin-top: 3em;
        }

        h3 {
            font-size: 1em;
            margin-top: 3em;
        }

        a {
            color: #449dad;
        }

        table {
            border-collapse: collapse;
            margin: 20px;
            th {
                text-align: left;
                font-weight: normal;
                color: #888;
                text-transform: uppercase;
                font-weight: 600;
                font-size: 0.8em;
                border-bottom: 1px solid #ccc;
            }
            td,
            th {
                padding: 10px 0;
                padding-right: 40px;
            }
        }

        blockquote {
            padding: 0;
            margin: 2em 0;
            border-left: 5px solid #c9e5e9;
            padding-left: 10px;
            font-style: italic;
        }

        header {
            background: #e4f2f4;
            color: scale-color($color: #e4f2f4, $saturation: -30%, $lightness: -40%);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            font-size: 0.85em;
            padding: 20px;
            border-radius: 3px;
            margin-bottom: 50px;
        }

        pre[class*="language-"] {
            //background: none;
            margin: 2em 0;
        }

        .live-code {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 10px;
            margin: 2em 0;

            pre {
                margin: 0;
                font-size: 0.85em;
                background: none;
                line-height: 150%;

                .line-numbers-rows {
                    margin-top: -0.5em; // not sure why exactly
                    line-height: 150%;
                    border-right: none;
                }
            }

            iframe {
                height: 300px;
                width: 300px;
                border: none;
                border-radius: 10px;
            }
        }
    }
</style>
