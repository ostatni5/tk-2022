<script lang="ts">
    import SvelteTable from 'svelte-table/src/index';

    export let data: {url: string}[] = [];

    let columns = [];
    let search: string = '';
    let hiddenColumns = [];

    $: updateTable(data);
    $: visibleRows = [];
    $: visibleColumns = [];

    const updateTable = (data) => {
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
    }

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
