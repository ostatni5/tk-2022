<script context="module" lang="ts">
    export const prerender = true;
</script>

<script lang="ts">
    import Form from '$lib/Form.svelte';
    import ResultsList from '../lib/resultsList/ResultsList.svelte';
</script>

<svelte:head>
    <title>ImageFinder</title>
</svelte:head>



<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
</style>
