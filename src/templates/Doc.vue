<page-query>
  query Doc ($path: String!) {
    doc: doc (path: $path) {
      title
      path
      content
    }
  }
</page-query>

<script>
    export default {
        metaInfo() {
            return {
                title: this.$page.doc.title,
                meta: [{key: "description", name: "description", content: this.$page.doc.description}],
            };
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
            $page(page) {
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
            <header class="page-header">{{ $page.doc.title }}</header>
            <div v-html="$page.doc.content" />
        </article>
    </Layout>
</template>


<style lang="scss">
    $max-width: 1200px;
    $nav-width: 180px;

    article {
        max-width: $max-width;
        margin: 0 auto;
        padding-left: $nav-width + 50px;
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

        a {
            color: #8ac9d4;
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
