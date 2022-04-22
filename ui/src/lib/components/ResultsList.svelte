<script lang="ts">
    export let data: { url: string }[] = [];
    let search: string = '';
    let copyMsg = 'Click to copy path!';

    $: updateTable(data);
    $: visibleResults = [];

    const updateTable = (data) => {
        visibleResults = search
            ? data.filter((el) => {
                  for (const key in el) {
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
    };

    function handleClick(url) {
        copyMsg = 'Copied!';
        setTimeout(resetCopyMsg, 500);
        window.navigator.clipboard.writeText(url);
    }

    function resetCopyMsg() {
        copyMsg = 'Click to copy path!';
    }
</script>

<div class="search-bar">
    <label>
        Search in results:
        <input
            type="text"
            placeholder="pattern"
            bind:value={search}
            on:change={() => updateTable(data)}
        />
    </label>
</div>

<div class="gallery">
    {#each visibleResults as result}
        <div
            class="img-wrapper tooltip"
            data-tooltip={copyMsg}
            on:click={() => handleClick(result.url)}
            on:mouseenter={() => resetCopyMsg()}
        >
            <img src="http://127.0.0.1:8082/image/{result.url}" />
            <div>
                <h2>{result.url}</h2>
            </div>
        </div>
    {/each}
    <div />
</div>

<style lang="scss">
    .search-bar {
        width: 100%;
        height: 2em;
        display: flex;
        align-items: center;
        padding: 1em 0.2em;

        * {
            font-size: large;
        }

        label {
            width: 100%;
            display: flex;
            align-items: center;
            align-content: space-between;
            gap: 0.4em;
        }

        input {
            flex-grow: 1;
            padding: 5px 7px;
        }
    }

    .gallery {
        display: flex;
        flex-wrap: wrap;
    }

    .img-wrapper {
        height: 27vh;
        flex-grow: 1;
        padding: 4px;
        padding-bottom: 0;
        margin: 3px;
        display: flex;
        flex-direction: column;
        background-color: var(--tertiary-color);

        img {
            height: 80%;
            width: 100%;
            object-fit: cover;
            vertical-align: bottom;
        }

        h2 {
            flex-grow: 1;
            padding-left: 0.2em;
            padding-right: 0.2em;
            width: 0;
            min-width: 95%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            direction: rtl;
            text-align: end;
            vertical-align: middle;
        }
    }

    div:last-child {
        flex-grow: 10;
    }

    .img-wrapper:hover {
        h2 {
            color: var(--accent-color);
            text-decoration: underline;
        }
    }

    .tooltip {
        position: relative;
    }

    .tooltip:before {
        content: attr(data-tooltip);
        position: absolute;

        left: 50%;
        transform: translateX(-50%);

        top: 40%;

        width: 50%;
        padding: 10px;
        border-radius: 10px;
        background: var(--primary-color);
        color: var(--text-color);
        text-align: center;

        display: none;
    }

    .tooltip:hover:before {
        display: block;
    }
</style>
