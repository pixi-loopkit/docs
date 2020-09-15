
<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<template>
    <div class="layout">
        <header class="topnav">
            <g-link to="/">{{ $static.metadata.siteName }}</g-link>
        </header>
        <slot />
    </div>
</template>

<style lang="scss">
    body {
        font-family: Roboto, sans-serif;
        margin: 0;
        padding: 0;
        line-height: 1.5;
    }

    .layout {
        max-width: 900px;
        margin: 0 auto;
        padding: 20px 0;
    }

    header.topnav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        font-weight: 600;

        a {
            color: #333;
            text-decoration: none;
        }
    }
</style>
