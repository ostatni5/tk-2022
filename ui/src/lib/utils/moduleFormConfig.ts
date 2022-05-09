import type { FlashType } from './flashOptions';
import type { WeatherType } from './weatherOptions';

function notEmptyString(value: string): string {
    if (value.length === 0) return undefined;
    return value;
}

function notNullNumber(value: number): number {
    if (value === null) return undefined;
    return value;
}

function notEmptyHex(value: string): number {
    const parsed = parseInt(value, 16);
    if (isNaN(parsed)) return undefined;
    return parsed;
}

export abstract class AbstractModuleConfig {
    _active: boolean;
    name: string;
    get active() {
        return this._active;
    }
    abstract get allConfig(): Record<string, any> & { name: string };
    constructor(name) {
        this._active = false;
        this.name = name;
    }
}

export class FormRange {
    min: number;
    max: number;
    clamp(property: keyof FormRange, value: number) {
        switch (property) {
            case 'min':
                this.min = Math.min(value, this.max);
                break;
            case 'max':
                this.max = Math.max(value, this.min);
                break;
        }
    }

    constructor() {
        this.min = null;
        this.max = null;
    }
}

class TextModuleConfig extends AbstractModuleConfig {
    _hasText: boolean;
    get hasText() {
        return this._hasText;
    }
    _length: FormRange;
    get maxLength() {
        return notNullNumber(this._length.max);
    }
    get minLength() {
        return notNullNumber(this._length.min);
    }

    _containsText: string;
    get containsText() {
        return notEmptyString(this._containsText);
    }
    get allConfig() {
        const { name, hasText, maxLength, minLength, containsText } = this;
        const obj = {
            name,
            hasText,
            ...(hasText && {
                maxLength,
                minLength,
                containsText,
            }),
        };
        Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
        return obj;
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
        return notEmptyString(this._createdAfter);
    }
    _createdBefore: string;
    get createdBefore() {
        return notEmptyString(this._createdBefore);
    }
    _flash: FlashType | '';
    get flash() {
        return notEmptyHex(this._flash);
    }
    _fNumber: number;
    get fNumber() {
        return notNullNumber(this._fNumber);
    }
    _focalLength: number;
    get focalLength() {
        return notNullNumber(this._focalLength);
    }
    _exposureTime: number;
    get exposureTime() {
        return notNullNumber(this._exposureTime);
    }
    _pixelXDim: FormRange;
    _pixelYDim: FormRange;
    get pixelXDimMax() {
        return notNullNumber(this._pixelXDim.max);
    }
    get pixelXDimMin() {
        return notNullNumber(this._pixelXDim.min);
    }
    get pixelYDimMax() {
        return notNullNumber(this._pixelYDim.max);
    }
    get pixelYDimMin() {
        return notNullNumber(this._pixelYDim.min);
    }
    get allConfig() {
        const {
            name,
            createdAfter,
            createdBefore,
            flash,
            fNumber,
            focalLength,
            exposureTime,
            pixelXDimMin,
            pixelXDimMax,
            pixelYDimMin,
            pixelYDimMax,
        } = this;
        const obj = {
            name,
            createdAfter,
            createdBefore,
            flash,
            fNumber,
            focalLength,
            exposureTime,
            pixelXDimMin,
            pixelXDimMax,
            pixelYDimMin,
            pixelYDimMax,
        };
        Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
        return obj;
    }

    constructor() {
        super('metadata');
        this._createdAfter = '';
        this._createdBefore = '';
        this._flash = '';
        this._fNumber = null;
        this._focalLength = null;
        this._exposureTime = null;
        this._pixelXDim = new FormRange();
        this._pixelYDim = new FormRange();
    }
}

export function isMetadataConfig(config: AbstractModuleConfig): config is MetadataModuleConfig {
    return config.name === 'metadata';
}

class WeatherModuleConfig extends AbstractModuleConfig {
    _weather_type: WeatherType;
    get weatherType() {
        return notEmptyString(this._weather_type);
    }
    _precision: number;
    get precision() {
        return notNullNumber(this._precision);
    }
    get allConfig() {
        const { name, weatherType, precision } = this;
        const obj = { name, weatherType, precision };
        Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
        return obj;
    }
    constructor() {
        super('weather');
        this._weather_type = 'clear';
        this._precision = null;
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
