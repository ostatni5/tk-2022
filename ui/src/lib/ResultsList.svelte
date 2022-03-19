<script lang="ts">
	import SvelteTable from 'svelte-table';

	const rows = [
		{ id: 1, first_name: 'Marilyn', last_name: 'Monroe', pet: 'dog' },
		{ id: 2, first_name: 'Abraham', last_name: 'Lincoln', pet: 'dog' },
		{ id: 3, first_name: 'Mother', last_name: 'Teresa', pet: '' },
		{ id: 4, first_name: 'John F.', last_name: 'Kennedy', pet: 'dog' },
		{ id: 5, first_name: 'Martin Luther', last_name: 'King', pet: 'dog' },
		{ id: 6, first_name: 'Nelson', last_name: 'Mandela', pet: 'cat' },
		{ id: 7, first_name: 'Winston', last_name: 'Churchill', pet: 'cat' },
		{ id: 8, first_name: 'George', last_name: 'Soros', pet: 'bird' },
		{ id: 9, first_name: 'Bill', last_name: 'Gates', pet: 'cat' },
		{ id: 10, first_name: 'Muhammad', last_name: 'Ali', pet: 'dog' },
		{ id: 11, first_name: 'Mahatma', last_name: 'Gandhi', pet: 'bird' },
		{ id: 12, first_name: 'Margaret', last_name: 'Thatcher', pet: 'cat' },
		{ id: 13, first_name: 'Christopher', last_name: 'Columbus', pet: 'dog' },
		{ id: 14, first_name: 'Charles', last_name: 'Darwin', pet: 'dog' },
		{ id: 15, first_name: 'Elvis', last_name: 'Presley', pet: 'dog' },
		{ id: 16, first_name: 'Albert', last_name: 'Einstein', pet: 'dog' },
		{ id: 17, first_name: 'Paul', last_name: 'McCartney', pet: 'cat' },
		{ id: 18, first_name: 'Queen', last_name: 'Victoria', pet: 'dog' },
		{ id: 19, first_name: 'Pope', last_name: 'Francis', pet: 'cat' }
	];

	// define column configs
	const columns = [
		{
			key: 'id',
			title: 'ID',
			value: (v) => v.id,
			sortable: true,
			headerClass: 'text-left'
		},
		{
			key: 'first_name',
			title: 'FIRST_NAME',
			value: (v) => v.first_name,
			sortable: true
		},
		{
			key: 'last_name',
			title: 'LAST_NAME',
			value: (v) => v.last_name,
			sortable: true
		},
		{
			key: 'pet',
			title: 'Pet',
			value: (v) => v.pet,
			renderValue: (v) => v.pet.charAt(0).toUpperCase() + v.pet.substring(1), // capitalize
			sortable: true
		}
	];

	let search: string = '';
	$: visibleRows = search
		? rows.filter((el) => {
				for (const key in el) {
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
