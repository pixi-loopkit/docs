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
                document.querySelectorAll("pre").forEach(pre => {
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
    <Layout class="doc-page">
        <h1>
            {{ $page.doc.title }}
        </h1>
        <div class="markdown" v-html="$page.doc.content" />
    </Layout>
</template>


<style lang="scss">
    .doc-page {
        .live-code {
            display: grid;
            grid-template-columns: 600px 300px;
            gap: 10px;
            margin: 2em 0;

            pre {
                margin: 0;
                font-size: 0.85em;
                background: none;
            }

            iframe {
                height: 300px;
                width: 300px;
                border: none;
            }
        }
    }
</style>
