<template>
    <h1 class="title">App</h1>
    <ul>
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
    </ul>

    <router-view />
</template>

<script setup>
console.log('PROJECT_TITLE', PROJECT_TITLE);
</script>

<style lang="scss" scoped>
.title {
    color: pink;
}
</style>
