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

        if(formData["metadata"].active){
            let new_options:Record<string,any> = {};
            new_options.name = "metadata";  
            if(formData.metadata.createdAfter !== '') new_options.createdAfter = formData.metadata.createdAfter;
            if(formData.metadata.createdBefore !== '') new_options.createdBefore = formData.metadata.createdBefore;
            if(formData.metadata.flash !== '') new_options.flash = parseInt(formData.metadata.flash, 16);
            if(formData.metadata.fNumber) new_options.fNumber = formData.metadata.fNumber;
            if(formData.metadata.focalLength) new_options.focalLength = formData.metadata.focalLength;
            if(formData.metadata.exposureTime !== '') new_options.exposureTime = parseInt(formData.metadata.exposureTime);
            if(formData.metadata.pixelXDimMin !== '') new_options.pixelXDimMin = parseInt(formData.metadata.pixelXDimMin);
            if(formData.metadata.pixelXDimMax !== '') new_options.pixelXDimMax = parseInt(formData.metadata.pixelXDimMax);
            if(formData.metadata.pixelYDimMin !== '') new_options.pixelYDimMin = parseInt(formData.metadata.pixelYDimMin);
            if(formData.metadata.pixelYDimMax !== '') new_options.pixelYDimMax = parseInt(formData.metadata.pixelYDimMax);

            request.moduleOptions.push(new_options);
        };
        if(formData ["text"].active){
            const {name, hasText, maxLength, minLength, containsText} = formData["text"]
            let new_options:Record<string,any> = {
                name,
                hasText,
                ...hasText && {
                    maxLength,
                    minLength,
                    containsText
                }
            };

            request.moduleOptions.push(new_options);
        };

        if(formData.weather.active){
            const {weather_type, precision} = formData.weather;
            let new_options:Record<string,any> = {
                weather_type,
                precision,
                name: "weather"
            }
            request.moduleOptions.push(new_options);
        }

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