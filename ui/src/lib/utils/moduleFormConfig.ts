abstract class AbstractModuleConfig {
    _active: boolean;
    name: string;
    get active() {
        return this._active;
    }
    constructor(name) {
        this._active = false;
        this.name = name;
    }
}

export class FormRange {
    min: string;
    max: string;
    clamp(property: keyof FormRange, value: string) {
        switch (property) {
            case 'min':
                this.min = Math.min(parseFloat(value), parseFloat(this.max)).toString();
                break;
            case 'max':
                this.max = Math.max(parseFloat(value), parseFloat(this.min)).toString();
                break;
        }
    }

    constructor() {
        this.min = '';
        this.max = '';
    }
}

class TextModuleConfig extends AbstractModuleConfig {
    _hasText: boolean;
    get hasText() {
        return this._hasText;
    }
    _length: FormRange;
    get maxLength() {
        return parseInt(this._length.max);
    }
    get minLength() {
        return parseInt(this._length.min);
    }

    _containsText: string;
    get containsText() {
        return this._containsText;
    }
    constructor() {
        super('text');
        this._hasText = false;
        this._containsText = '';
        this._length = new FormRange();
    }
}

export function isTextConfig(config: AbstractModuleConfig): config is TextModuleConfig {
    return config.name === 'text';
}

class MetadataModuleConfig extends AbstractModuleConfig {
    _createdAfter: string;
    get createdAfter() {
        return this._createdAfter;
    }
    _createdBefore: string;
    get createdBefore() {
        return this._createdBefore;
    }
    _flash: string;
    get flash() {
        return parseInt(this._flash, 16);
    }
    _fNumber: string;
    get fNumber() {
        return parseFloat(this._fNumber);
    }
    _focalLength: string;
    get focalLength() {
        return parseInt(this._focalLength);
    }
    _exposureTime: string;
    get exposureTime() {
        return parseFloat(this._exposureTime);
    }
    _pixelXDim: FormRange;
    _pixelYDim: FormRange;
    get pixelXDimMax() {
        return parseInt(this._pixelXDim.max);
    }
    get pixelXDimMin() {
        return parseInt(this._pixelXDim.min);
    }
    get pixelYDimMax() {
        return parseInt(this._pixelYDim.max);
    }
    get pixelYDimMin() {
        return parseInt(this._pixelYDim.min);
    }
    constructor() {
        super('metadata');
        this._createdAfter = '';
        this._createdBefore = '';
        this._flash = '';
        this._fNumber = '';
        this._focalLength = '';
        this._exposureTime = '';
        this._pixelXDim = new FormRange();
        this._pixelYDim = new FormRange();
    }
}

export function isMetadataConfig(config: AbstractModuleConfig): config is MetadataModuleConfig {
    return config.name === 'metadata';
}

class WeatherModuleConfig extends AbstractModuleConfig {
    _weather_type: string;
    get weatherType() {
        return this._weather_type;
    }
    _precision: string;
    get precision() {
        return parseInt(this._precision);
    }
    constructor() {
        super('weather');
        this._weather_type = '';
        this._precision = '';
    }
}

export function isWeatherConfig(config: AbstractModuleConfig): config is WeatherModuleConfig {
    return config.name === 'weather';
}

const array = [
    ['text', new TextModuleConfig()],
    ['metadata', new MetadataModuleConfig()],
    ['weather', new WeatherModuleConfig()],
    /*
    ['another module', new AnotherModuleConfig()],
    */
] as [string, AbstractModuleConfig][];
export default array.reduce((acc, [name, config]) => {
    acc[name] = config;
    return acc;
}, {} as Record<string, AbstractModuleConfig>);
