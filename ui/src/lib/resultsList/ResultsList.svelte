<script lang="ts">
    import SvelteTable from 'svelte-table/src/index';
    // import { resultsData } from './data';
    import { afterUpdate } from 'svelte';

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

            // console.log(prepareColumns['url'])
            // prepareColumns['url'].renderValue = (v) =>
            //     `<a href="${v.url}" target="_explorer.exe">Link Text</a>`
            //     // `<button style="width:100px;height:100px;" onclick="console.log('we'); window.open('${v.url}', '_blank').focus();"></button>`
            //     // `<a href="${v.url}">${v.url}</a>`
            // // `<img src='${v.url}' width=100 height=80 onError="console.log(this.onerror)">`;
            // // `<div style="background-image:url('${v.url}');width:100px;height:80px;" onError="console.log(this.onerror)">`;
            // prepareColumns['url'].title = 'IMAGE';

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
