<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import ImageFinder from '$lib/components/ImageFinder.svelte';
    import '../app.css';
</script>

<Header />

<main>
    <slot />
    <ImageFinder />
</main>

<footer />

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 5vw;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }

    @media (min-width: 480px) {
        footer {
            padding: 40px 0;
        }
    }
</style>
