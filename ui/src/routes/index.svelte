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

<section>
    <Form />
</section>

<section style="margin-top: 100px;">
    <ResultsList />
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }
</style>
