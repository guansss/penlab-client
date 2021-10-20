<template>
    <div class="main container">
        <div class="works">
            <WorkItems v-for="(work, i) in WORKS" :key="i" :work="work" />
        </div>
    </div>
</template>

<script setup lang="ts">
import WorkItems from '../components/WorkItems.vue';
import { WORKS } from '../data/works';
</script>

<style scoped>
.main {
    margin-top: 36px;
    margin-bottom: 48px;
}

.works {
    display: grid;
    grid-template-columns: 1fr;
    gap: 36px;
}

@media (min-width: 992px) {
    .works {
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    }
}
</style>
