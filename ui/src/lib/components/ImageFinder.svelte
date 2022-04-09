<script lang="ts">
    import Form from './Form.svelte';
    import ResultsList from './ResultsList.svelte';
    import { sendRequest } from '../utils/request.utils';
    import type { ImagesRequest, ImagesResponse } from '../utils/request.utils';
    import { Shadow } from 'svelte-loading-spinners';

    $: results = [];
    $: searching = false;

    const createRequest = (formData): ImagesRequest => {
        const request = {
            path: formData.path,
            moduleOptions: []
        };

        if(formData.metadata.active){
            request.moduleOptions.push({
                name: "metadata",
                dateAfter: formData.metadata.createdAfter ?
                    new Date(formData.metadata.createdAfter) : undefined,
                dateBefore: formData.metadata.createdBefore ?
                    new Date(formData.metadata.createdBefore) : undefined
            });
        };

        return request;
    }

    const handleResponse = (response: ImagesResponse) => {
        console.log("Response", response);
        const items = [];
        for(const item of response.pictures){
            items.push({
                index: items.length + 1,
                url: item.split('\\').join('/'),
                size: 'NA',
                dimensions: 'NA',
                name: item.replace(/^.*[\\\/]/, ''),
                created: new Date().toLocaleString()
            })
        }
        results = items;
        searching = false;
    }

    const handleSearch = (e: CustomEvent) => {
        searching = true;
        const request = createRequest(e.detail);
        console.log("Request", request);
        sendRequest(request, handleResponse);
    }
</script>

<Form on:search={handleSearch} searching={searching}/>

{#if searching}
<div style="margin-top: 60px; display: flex; justify-content: center;">
    <Shadow size="50" color="var(--secondary-color)" unit="px" duration="1s" />
</div>
{/if}

<span style="margin-top: 80px"></span>
<ResultsList data={results}/>