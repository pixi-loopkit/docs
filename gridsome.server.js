module.exports = function(api) {
    api.loadSource(({addCollection}) => {
        // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    });

    api.createPages(async ({graphql, createPage}) => {
        const response = await graphql(
            `
                {
                    allDoc {
                        edges {
                            node {
                                title
                                slug
                                order
                                path
                                content
                            }
                        }
                    }
                }
            `
        );
        if (response.errors) {
            throw response.errors;
        }

        let docs = response.data.allDoc.edges.map(edge => edge.node);

        docs.forEach(doc => {
            let leaf = doc.path.split("/").slice(-2, -1)[0];
            doc.leaf = leaf;
            doc.slug = doc.slug || leaf;
            createPage({
                path: `/${doc.slug}`,
                component: "./src/Doc.vue",
                context: {
                    doc,
                },
            });

            if (doc.order === 0) {
                createPage({
                    path: `/`,
                    component: "./src/Doc.vue",
                    context: {
                        doc,
                    },
                });
            }
        });
    });
};
