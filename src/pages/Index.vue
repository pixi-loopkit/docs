<script>
    export default {
        metaInfo: {
            title: "Hello, world!",
        },
    };
</script>

<template>
    <Layout>
        <!-- Learn how to use images here: https://gridsome.org/docs/images -->
        <g-image alt="Example image" src="~/favicon.png" width="135" />

        <h1>Hello, world!</h1>
        <g-link to="/pants"> Can has demo </g-link>
    </Layout>
</template>

<style>
    .home-links a {
        margin-right: 1rem;
    }
</style>
