<template>
    <h1>About</h1>
    {{ store.state }}
</template>

<script setup>
import { useStore } from 'vuex';

const store = useStore();
</script>

<style lang="scss" scoped></style>
