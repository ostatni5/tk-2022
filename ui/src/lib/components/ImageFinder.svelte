<script lang="ts">
    import Form from './Form.svelte';
    import ResultsList from './ResultsList.svelte';
    import { sendRequest } from '../utils/request.utils';
    import type { ImagesRequest, ImagesResponse } from '../utils/request.utils';
    import { Shadow } from 'svelte-loading-spinners';
    import type {AbstractModuleConfig} from '../utils/moduleFormConfig';

    $: results = [];
    $: searching = false;

    const createRequest = ({path, config}): ImagesRequest => {
        const moduleOptions = Object.values(config).filter(
            (option: AbstractModuleConfig) => option.active
        ).map(
            (module: AbstractModuleConfig) => module.allConfig
        )
        const request = {
            path,
            moduleOptions
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
                name: item.replace(/^.*[\\\/]/, ''), // this regex removes everything before filename
                created: new Date().toLocaleString()
            })
        }
        searching = false;
        results = items;
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