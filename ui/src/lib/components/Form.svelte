<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { slide } from 'svelte/transition';
    import { flashOptions } from '../utils/flashOptions';
    import { weatherOptions } from '../utils/weatherOptions';
    import formConfigMap, {isMetadataConfig, isTextConfig, isWeatherConfig, FormRange} from '../utils/moduleFormConfig';

    export let searching = false;

    const modules = Object.keys(formConfigMap);

    const moduleUis = {}
    modules.map(module => {
        moduleUis[module] ={
            arrowDirection: 'down',
            visible: false,
        };
    });

    const directory = {
        path: '',
        isValid: false,
    }

    const dispatch = createEventDispatcher();

    const isPath = (text: string) => {
        let re =
            /^(\/.*|[a-zA-Z]:[\\/](?:([^<>:"\/\\|?*]*[^<>:"\/\\|?*.][\\/]|..[\\/])*([^<>:"\/\\|?*]*[^<>:"\/\\|?*.][\\/]?|..[\\/]))?)$/;
        return re.test(text);
    };

    const handlePathInput = (e: Event) => {
        directory.path = (e.target as HTMLInputElement).value;
        directory.isValid = isPath((e.target as HTMLInputElement).value);
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

    const handleSubmit = () => {
        if (directory.isValid) {
            dispatch('search', formConfigMap);
        }
    };

    const handleRangeChange = (range:FormRange, property: keyof FormRange) => (e: Event) => {
        let input = e.target as HTMLInputElement;
        range.clamp(property, input.value);
    }
</script>

<form on:submit|preventDefault={handleSubmit} autocomplete="off">


    <!-- PATH SECTION -->
    <div class="inputContainer">
        <label
            >Path to directory
            <input
                type="text"
                on:input={handlePathInput}
                bind:value={directory.path}
                placeholder="C:/images"
                autocomplete="on"
            />
        </label>
        {#if !(directory.path.length === 0 || directory.isValid)}
            <p class="errorMessage">This is not a vaild path</p>
        {/if}
    </div>


    <!-- METADATA SECTION -->
    <div class="inputContainer">
        <p class="inputContainerTitle" on:click={handleClick('metadata')}>
            <input
                type="checkbox"
                bind:checked={formConfigMap['metadata']._active}
                on:click|stopPropagation
            />
            Metadata <i class="arrow {moduleUis['metadata'].arrowDirection}" />
        </p>
        {#if moduleUis['metadata'].visible &&  isMetadataConfig(formConfigMap['metadata'])}
            <div class="moduleForm" transition:slide>
                <label class="span2col select"
                    >Flash stats
                    <select bind:value={formConfigMap['metadata']._flash}>
                        <option value="">Any</option>
                        {#each flashOptions as { value, name }}
                            <option {value}>{name}</option>
                        {/each}
                    </select>
                </label>
                <label
                    >Created after
                    <input
                        type="date"
                        bind:value={formConfigMap['metadata']._createdAfter}
                        on:change={changeDate}
                    />
                </label>
                <label
                    >Created before
                    <input
                        type="date"
                        bind:value={formConfigMap['metadata']._createdBefore}
                        on:change={changeDate}
                    />
                </label>
                <div class="fit3col">
                    <label
                        >F-number
                        <input
                            type="number"
                            name="fnumber"
                            bind:value={formConfigMap['metadata']._fNumber}
                            min="0"
                            step="0.01"
                        />
                    </label>
                    <label
                        >Focal length
                        <input
                            type="number"
                            name="focal"
                            bind:value={formConfigMap['metadata']._focalLength}
                            min="0"
                        />
                    </label>
                    <label
                        >Exposure time
                        <input
                            type="number"
                            name="exposure"
                            bind:value={formConfigMap['metadata']._exposureTime}
                            step="0.0001"
                        />
                    </label>
                </div>
                <label
                    >Minimal pixel count in X dimension
                    <input
                        type="number"
                        name="minPixelX"
                        bind:value={formConfigMap['metadata']._pixelXDim.min}
                        on:change={handleRangeChange(formConfigMap['metadata']._pixelXDim, 'min')}
                        min="0"
                    />
                </label>
                <label
                    >Maximal pixel count in X dimension
                    <input
                        type="number"
                        name="maxPixelX"
                        bind:value={formConfigMap['metadata']._pixelXDim.max}
                        on:change={handleRangeChange(formConfigMap['metadata']._pixelXDim, 'max')}
                        min="0"
                    />
                </label>
                <label
                    >Minimal pixel count in Y dimension
                    <input
                        type="number"
                        name="minPixelY"
                        bind:value={formConfigMap['metadata']._pixelYDim.min}
                        on:change={handleRangeChange(formConfigMap['metadata']._pixelYDim, 'min')}
                        min="0"
                    />
                </label>
                <label
                    >Maximal pixel count in Y dimension
                    <input
                        type="number"
                        name="maxPixelY"
                        bind:value={formConfigMap['metadata']._pixelYDim.max}
                        on:change={handleRangeChange(formConfigMap['metadata']._pixelYDim, 'max')}
                        min="0"
                    />
                </label>
            </div>
        {/if}
    </div>


    <!-- TEXT SECTION -->
    <div class="inputContainer">
        <p class="inputContainerTitle" on:click={handleClick('text')}>
            <input
                type="checkbox"
                bind:checked={formConfigMap['text']._active}
                on:click|stopPropagation
            />
            Text content <i class="arrow {moduleUis['text'].arrowDirection}" />
        </p>
        {#if moduleUis['text'].visible && isTextConfig(formConfigMap['text'])}
            <div class="moduleForm" transition:slide>
                <label
                    >Has Text
                    <input type="checkbox" bind:checked={formConfigMap['text']._hasText} />
                </label>
                <label class="span2col"
                    >Contains text
                    <input
                        type="text"
                        bind:value={formConfigMap['text']._containsText}
                        placeholder="text"
                        disabled={!formConfigMap['text']._hasText}
                    />
                </label>
                <label class="range"
                    >Min text length
                    <input
                        type="number"
                        name="minLength"
                        bind:value={formConfigMap['text']._length.min}
                        on:change={handleRangeChange(formConfigMap['text']._length, 'min')}
                        min="0"
                        disabled={!formConfigMap['text']._hasText}
                    />
                </label>
                <label class="range"
                    >Max text length
                    <input
                        type="number"
                        name="maxLength"
                        bind:value={formConfigMap['text']._length.max}
                        on:change={handleRangeChange(formConfigMap['text']._length, 'max')}
                        min="0"
                        disabled={!formConfigMap['text']._hasText}
                    />
                </label>
            </div>
        {/if}
    </div>


    <!-- WEATHER SECTION -->
    <div class="inputContainer">
        <p class="inputContainerTitle" on:click={handleClick('weather')}>
            <input
                type="checkbox"
                bind:checked={formConfigMap['weather']._active}
                on:click|stopPropagation
            />
            Weather conditions <i class="arrow {moduleUis['weather'].arrowDirection}" />
        </p>
        {#if moduleUis['weather'].visible && isWeatherConfig(formConfigMap['weather'])}
            <div class="moduleForm" transition:slide>
                <label class="span2col select"
                    >Weather type
                    <select bind:value={formConfigMap['weather']._weather_type}>
                        <option value="">Any</option>
                        {#each weatherOptions as { value, name }}
                            <option {value}>{name}</option>
                        {/each}
                    </select>
                </label>
                <label
                    >Prediction precision
                    <input
                        type="number"
                        name="precision"
                        bind:value={formConfigMap['weather']._precision}
                        min="0"
                        max="9"
                        step="1"
                    />
                </label>
            </div>
        {/if}
    </div>


    <!-- SUBMIT SECTION -->
    <div class="submitContainer">
        <input type="submit" value="Search" disabled={!directory.isValid || searching} />
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
    input[type='number'],
    input[type='date'],
    select {
        width: 100%;
        padding: 12px 20px;
        margin: 5px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    .select {
        display: flex;
        align-items: center;
        select {
            flex-grow: 1;
        }
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
    // .range input[type='range'] {
    //     transform: translateY(2px);
    // }

    .range .label {
        position: absolute;
        transform: translatey(4px);
        font-size: 0.8rem;
    }
    .span2col {
        grid-column: span 2;
        input[type='number'] {
            width: 25%;
            margin-right: 75%;
        }
    }
    .fit3col {
        grid-column: span 2;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 0.5rem 2rem;
        input[type='number'] {
            width: 100%;
        }
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
