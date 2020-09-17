
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
        data() {
            return {
                sections: [],
            };
        },

        mounted() {
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
                    subnav: headings,
                });
            });

            this.sections.sort((a, b) => a.order - b.order);
        },
    };
</script>

<template>
    <main>
        <div class="actions-panel">
            <nav>
                <g-link class="logo" to="/">
                    <img src="/logo.png" />
                </g-link>

                <section v-for="section in sections" :key="section.slug">
                    <header>
                        {{ section.title }}
                    </header>
                    <div>
                        <g-link
                            v-for="(heading, idx) in section.subnav"
                            :key="heading.path"
                            :to="idx == 0 ? heading.path.split('#')[0] : heading.path"
                        >
                            {{ heading.title }}
                        </g-link>
                    </div>
                </section>
            </nav>
        </div>

        <slot />
    </main>
</template>

<style lang="scss">
    $max-width: 1200px;
    $nav-width: 180px;

    body {
        font-family: Roboto, sans-serif;
        margin: 0;
    }

    * {
        box-sizing: border-box;
    }

    .actions-panel {
        left: 0;
        right: 0;
        bottom: 0;
        position: fixed;
        max-width: $max-width;
        margin: 0 auto;
        top: 0;
        z-index: 500;
        pointer-events: none;

        nav {
            position: absolute;
            top: 30px;
            left: 0;
            width: $nav-width;
            bottom: 0;
            background: transparent;
            pointer-events: all;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        a.logo {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            text-decoration: none;
            font-weight: 600;
            color: #333;

            img {
                display: block;
                width: 120px;
                border-radius: 10px;
            }
        }

        section {
            width: 100%;
            padding: 10px;

            header {
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.025em;
                font-weight: 600;
                color: #999;
                padding-bottom: 16px;
                padding-top: 32px;
            }

            a {
                padding: 5px 0;
                display: block;
                text-decoration: none;
                color: #333;

                &.active--exact {
                    color: #30b8ce;
                    font-weight: 600;
                    font-size: 15px;
                }
            }
        }
    }
</style>
