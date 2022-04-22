<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { slide } from 'svelte/transition';

    export let searching = false;

    const formData = {
        path: '',
        metadata: {
            active: false,
            createdAfter: '',
            createdBefore: '',
        },
        text: {
            active: false,
            hasText: false,
            maxLength: '2000',
            minLength: '0',
            containsText: '',
        },
        // weather: {
        //     active: false,
        //     ...
        // }
    };

    let wrongPath = true;
    let arrowDirection = 'down';
    let metadataVisible = false;

    const dispatch = createEventDispatcher();

    const isPath = (text: string) => {
        let re =
            /^(\/.*|[a-zA-Z]:[\\/](?:([^<>:"\/\\|?*]*[^<>:"\/\\|?*.][\\/]|..[\\/])*([^<>:"\/\\|?*]*[^<>:"\/\\|?*.][\\/]?|..[\\/]))?)$/;
        return re.test(text);
    };

    const handlePathInput = (e: Event) => {
        wrongPath = !isPath((e.target as HTMLInputElement).value);
    };

    const handleClick = (module: string) => () => {
        if (moduleUis[module].visible) {
            moduleUis[module].arrowDirection = 'down';
            moduleUis[module].visible = false;
        } else {
            moduleUis[module].arrowDirection = 'up';
            moduleUis[module].visible = true;
        }
    };

    const changeDate = (e: Event) => {
        let input = e.target as HTMLInputElement;
        input.style.color = input.value !== '' ? 'black' : '';
    };

    const changeRange = (e: Event) => {
        let input = e.target as HTMLInputElement;
        if (parseInt(formData.text.maxLength) < parseInt(formData.text.minLength))
            if (input.name === 'minLength') {
                formData.text.minLength = formData.text.maxLength;
                input.value = formData.text.minLength;
            } else {
                formData.text.maxLength = formData.text.minLength;
                input.value = formData.text.maxLength;
            }
    };

    const handleSubmit = () => {
        if (isPath(formData.path)) {
            dispatch('search', formData);
        }
    };

    const moduleUis = {
        metadata: {
            arrowDirection: 'down',
            visible: false,
        },
        text: {
            arrowDirection: 'down',
            visible: false,
        },
        // weather:{
        //     arrowDirection: 'down',
        //     visible: false,
        // }
    };
</script>

<form on:submit|preventDefault={handleSubmit} autocomplete="off">
    <div class="inputContainer">
        <label
            >Path to directory
            <input
                type="text"
                on:input={handlePathInput}
                bind:value={formData.path}
                placeholder="C:/images"
                autocomplete="on"
            />
        </label>
        {#if wrongPath && formData.path.length != 0}
            <p class="errorMessage">This is not a path</p>
        {/if}
    </div>
    <div class="inputContainer">
        <p class="inputContainerTitle" on:click={handleClick('metadata')}>
            <input
                type="checkbox"
                bind:checked={formData['metadata'].active}
                on:click|stopPropagation
            />
            Metadata <i class="arrow {arrowDirection}" />
        </p>
        {#if moduleUis['metadata'].visible}
            <div class="moduleForm" transition:slide>
                <!-- <label
                    >Author
                    <input type="text" bind:value={formData["metadata"].author} placeholder="John Smith" />
                </label>
                <label
                    >Extension
                    <input type="text" bind:value={formData["metadata"].extension} placeholder="png" />
                </label> -->
                <label
                    >Created after
                    <input
                        type="date"
                        bind:value={formData['metadata'].createdAfter}
                        on:change={changeDate}
                    />
                </label>
                <label
                    >Created before
                    <input
                        type="date"
                        bind:value={formData['metadata'].createdBefore}
                        on:change={changeDate}
                    />
                </label>
            </div>
        {/if}
    </div>
    <div class="inputContainer">
        <p class="inputContainerTitle" on:click={handleClick('text')}>
            <input
                type="checkbox"
                bind:checked={formData['text'].active}
                on:click|stopPropagation
            />
            Text content <i class="arrow {arrowDirection}" />
        </p>
        {#if moduleUis['text'].visible}
            <div class="moduleForm" transition:slide>
                <label
                    >Has Text
                    <input type="checkbox" bind:checked={formData['text'].hasText} />
                </label>
                <label class="span2col"
                    >Contains text
                    <input
                        type="text"
                        bind:value={formData['text'].containsText}
                        placeholder="text"
                        disabled={!formData['text'].hasText}
                    />
                </label>
                <label class="range"
                    >Min text length
                    <input
                        type="range"
                        name="minLength"
                        bind:value={formData['text'].minLength}
                        on:change={changeRange}
                        min="0"
                        max="2000"
                        disabled={!formData['text'].hasText}
                    /> <span class="label">{formData['text'].minLength}</span>
                </label>
                <label class="range"
                    >Max text length
                    <input
                        type="range"
                        name="maxLength"
                        bind:value={formData['text'].maxLength}
                        on:change={changeRange}
                        min="0"
                        max="2000"
                        disabled={!formData['text'].hasText}
                    /> <span class="label">{formData['text'].maxLength}</span>
                </label>
            </div>
        {/if}
    </div>
    <div class="submitContainer">
        <input type="submit" value="Search" disabled={wrongPath || searching} />
    </div>
</form>

<style lang="scss">
    label {
        margin-top: 15px;
        display: inline-block;
        width: 100%;
        font-weight: bold;
    }

    input[type='text'],
    input[type='date'] {
        width: 100%;
        padding: 12px 20px;
        margin: 5px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    input[type='date'] {
        color: rgba(0, 0, 0, 0.3);
    }

    .submitContainer {
        display: flex;
        justify-content: center;
    }
    input[type='submit'] {
        width: 30%;
        background-color: var(--secondary-color);
        color: white;
        padding: 14px 20px;
        margin-top: 30px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    input[type='submit']:hover {
        background-color: #255685;
    }
    input[type='submit']:disabled {
        background-color: #7da3c7;
        cursor: auto;
        color: #eee;
        cursor: not-allowed;
    }

    input::placeholder {
        opacity: 0.3;
    }
    input:focus::placeholder {
        color: transparent;
    }

    .errorMessage {
        margin: 0;
        color: rgb(182, 19, 19);
        font-weight: bold;
    }

    form {
        width: 100%;
        margin: 0 auto;
    }

    .inputContainer {
        margin-top: 10px;
        border-radius: 5px;
        background-color: #f2f2f2;
        padding: 20px 20px;
    }
    .inputContainerTitle {
        margin: 0;
        font-weight: bold;
        color: black;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .moduleForm {
        label {
            flex: 0 1 45%;
        }
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem 2rem;
    }
    .moduleForm .range {
        max-width: fit-content;
        margin-inline: auto;
    }
    .range input {
        transform: translateY(2px);
    }

    .range .label {
        position: absolute;
        transform: translatey(4px);
        font-size: 0.8rem;
    }
    .span2col {
        grid-column: span 2;
    }

    .arrow {
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        margin-left: 3px;
    }
    .up {
        transform: rotate(-135deg);
        -webkit-transform: rotate(-135deg);
        margin-left: 6px;
    }
    .down {
        transform: rotate(45deg) translateY(-5px);
        -webkit-transform: rotate(45deg) translateY(-5px);
    }
</style>
