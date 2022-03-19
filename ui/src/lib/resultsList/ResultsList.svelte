<script lang="ts">
	import SvelteTable from 'svelte-table';
	import { resultsData } from './data';

	const rows = resultsData;

	const columns = [];
	if (resultsData.length > 0) {
		const prepareColumns = {};
		const object = resultsData[0];
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

		prepareColumns['url'].renderValue = (v) =>
			`<img src="https://picsum.photos/seed/${v.name}/20/20" alt="icon" width=20 height=20 >`;
		prepareColumns['url'].title = 'IMAGE';

		for (const key in prepareColumns) {
			columns.push(prepareColumns[key]);
		}
	}

	const exludeColumns = ['url'];
	let search: string = '';
	$: visibleRows = search
		? rows.filter((el) => {
				for (const key in el) {
					if (exludeColumns.includes(key)) continue;

					if (Object.prototype.hasOwnProperty.call(el, key)) {
						const element: string | number = el[key];
						const include = element.toString().toLowerCase().includes(search.toLowerCase());
						if (include) return true;
					}
				}
				return false;
		  })
		: rows;

	let hiddenColumns = [];
	$: visibleColumns = columns.filter((el) => !hiddenColumns.includes(el.key));
</script>

<label>Search in resluts: <input bind:value={search} /></label>
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
