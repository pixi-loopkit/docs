// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
    siteName: "pixi-loopkit",
    plugins: [
        {
            use: "@gridsome/source-filesystem",
            options: {
                typeName: "Doc",
                path: "./docs/**/*.md",
            },
        },
    ],
    transformers: {
        remark: {
            plugins: ["@gridsome/remark-prismjs"],
        },
    },
    templates: {
        Doc: "/:slug",
    },
};
