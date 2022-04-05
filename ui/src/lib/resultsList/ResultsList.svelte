<script lang="ts">
    import SvelteTable from 'svelte-table/src/index';
    import { afterUpdate } from 'svelte';
    import Gallery from 'svelte-gallery';

    const images = [
        { src: 'https://source.unsplash.com/random' },
        { src: 'https://source.unsplash.com/random'},
        { src: 'https://source.unsplash.com/random'},
        { src: 'https://source.unsplash.com/random'},
        { src: 'https://source.unsplash.com/random' },
        { src: 'https://source.unsplash.com/random'},
        { src: 'https://source.unsplash.com/random'},
        { src: 'https://source.unsplash.com/random'}
    ];

    export let data: {url: string}[] = [];

    let columns = [];
    let search: string = '';
    let hiddenColumns = [];

    $: visibleRows = [];
    $: visibleColumns = [];

    // maybe change after update to $
    // $: func(data);

    afterUpdate(() => {
        columns = [];
        if (data.length > 0) {
            const prepareColumns = {};
            const object = data[0];
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    prepareColumns[key] = {
                        key: key,
                        title: key.toLocaleUpperCase(),
                        value: (v) => v[key],
                        sortable: true
                    };
                }
            }

            prepareColumns['url'].renderValue = (v) => `<img src='http://127.0.0.1:8082/image/${v.url}' width=100 height=80 loading="lazy" >`;
            prepareColumns['url'].title = 'IMAGE';

            for (const key in prepareColumns) {
                columns.push(prepareColumns[key]);
            }
        }

        const excludeColumns = ['url'];

        visibleRows = search
            ? data.filter((el) => {
                for (const key in el) {
                    if (excludeColumns.includes(key)) continue;

                    if (Object.prototype.hasOwnProperty.call(el, key)) {
                        const element: string | number = el[key];
                        const include = element
                            .toString()
                            .toLowerCase()
                            .includes(search.toLowerCase());
                        if (include) return true;
                    }
                }
                return false;
            })
            : data;

        visibleColumns = columns.filter((el) => !hiddenColumns.includes(el.key));
    })

</script>

<label>Search in results: <input bind:value={search} /></label>
<div>
    <p>Hide columns</p>
    {#each columns as column}
        <label>
            <input type="checkbox" bind:group={hiddenColumns} value={column.key} />
            {column.key}
        </label>
    {/each}
</div>


<SvelteTable columns={visibleColumns} rows={visibleRows} />

<Gallery {images}  rowHeight={220}/>
