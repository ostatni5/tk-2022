<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition';
    import { Shadow } from 'svelte-loading-spinners';

    let formData = {
        pathText: '',
        author: '',
        dateOfCreation: '',
        dateOfModification: '',
        extension: ''
    };

    let wrongPath = true;
    let arrowDirection = 'down';
    let metadataVisible = false;
    let searching = false;

    const isPath = (text: string) => {
        let re =
            /^(\/.*|[a-zA-Z]:[\\/](?:([^<>:"\/\\|?*]*[^<>:"\/\\|?*.][\\/]|..[\\/])*([^<>:"\/\\|?*]*[^<>:"\/\\|?*.][\\/]?|..[\\/]))?)$/;
        return re.test(text);
    };

    const handlePathInput = (e: Event) => {
        wrongPath = !isPath((e.target as HTMLInputElement).value);
    };

    const handleMetadataClick = () => {
        arrowDirection = arrowDirection === 'down' ? 'up' : 'down';
        metadataVisible = !metadataVisible;
    };

    const changeDate = (e: Event) => {
        let input = e.target as HTMLInputElement;
        input.style.color = input.value !== '' ? 'black' : '';
    };


    const dispatch = createEventDispatcher();

    const handleSubmit = () => {
        if (isPath(formData.pathText)) {
            searching = true;
            console.log(formData);
        }
        setTimeout(() => (searching = false), 3000);
        dispatch('search', formData);
    }

</script>

<form on:submit|preventDefault={handleSubmit} autocomplete="off">
    <div class="inputContainer">
        <label
            >Path to directory
            <input
                type="text"
                on:input={handlePathInput}
                bind:value={formData.pathText}
                placeholder="C:/images"
            />
        </label>
        {#if wrongPath && formData.pathText !== ''}
            <p class="errorMessage">This is not a path</p>
        {/if}
    </div>
    <div class="inputContainer">
        <p class="inputContainerTitle" on:click={handleMetadataClick}>
            Metadata <i class="arrow {arrowDirection}" />
        </p>
        {#if metadataVisible}
            <div class="moduleForm" transition:slide>
                <label
                    >Author
                    <input type="text" bind:value={formData.author} placeholder="John Smith" />
                </label>
                <label
                    >Extension
                    <input type="text" bind:value={formData.extension} placeholder="png" />
                </label>
                <label
                    >Date of creation
                    <input
                        type="date"
                        bind:value={formData.dateOfCreation}
                        on:change={changeDate}
                    />
                </label>
                <label
                    >Date of modification
                    <input
                        type="date"
                        bind:value={formData.dateOfModification}
                        on:change={changeDate}
                    />
                </label>
            </div>
        {/if}
    </div>
    <div class="submitContainer">
        <input type="submit" value="Search" disabled={wrongPath || searching} />
    </div>
</form>
{#if searching}
    <p style="margin-top: 70px;" />
    <Shadow size="50" color="var(--secondary-color)" unit="px" duration="1s" />
{/if}

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
        width: 75%;
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
    }
    .moduleForm {
        label {
            flex: 0 1 45%;
        }
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
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
