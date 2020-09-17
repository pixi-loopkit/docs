// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from "~/Layout.vue";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

export default function(Vue, {router, head, isClient}) {
    // Set default layout as a global component
    Vue.config.productionTip = false;
    Vue.config.devtools = false;
    Vue.component("Layout", DefaultLayout);
}
