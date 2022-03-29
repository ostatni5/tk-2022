<script lang="ts">
    import Form from './Form.svelte';
    import ResultsList from './resultsList/ResultsList.svelte';
    import { serialize, deserialize } from 'bson';

    $: results = [];


    const handleSearch = (e: any) => {
        const formData = e.detail;

        let chunks: Uint8Array = new Uint8Array();
        fetch('http://127.0.0.1:8082/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: serialize({
                path: formData.pathText
            })
        })
        .then(async res => {
            const reader = res.body.getReader();

            while (true) {
                const {done, value} = await reader.read();
                if (done) {
                    break;
                }
                chunks = new Uint8Array([...chunks, ...value]);
            }
        })
        .then(() => {
            let arrayBuffer = chunks.buffer.slice(chunks.byteOffset, chunks.byteLength + chunks.byteOffset)
            let data = deserialize(arrayBuffer);
            console.log(data);

            let items = [];
            for(const item of data.pictures){
                items.push({
                    index: 1,
                    url: item.split('\\').join('/'),
                    size: 777602,
                    dimensions: '3667x446',
                    name: item.replace(/^.*[\\\/]/, ''),
                    gender: 'female',
                    created: new Date().toJSON()
                })
            }
            results = items;
        })
    }
</script>

<Form on:search={handleSearch}/>

<span style="margin-top: 150px"></span>
<ResultsList data={results}/>