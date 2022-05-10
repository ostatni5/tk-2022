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

function notEmptyDate(value: string): Date {
    if (value.length === 0) return undefined;
    return new Date(value);
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
        if (Number.isNaN(value)){
            value = null;
        }
        switch (property) {
            case 'min':
                this.min = value;
                break;
            case 'max':
                this.max = value;
                break;
        }
    }

    constructor() {
        this.min = null;
        this.max = null;
    }
}


class MetadataModuleConfig extends AbstractModuleConfig {
    _dateAfter: string;
    get dateAfter() {
        return notEmptyDate(this._dateAfter);
    }
    _dateBefore: string;
    get dateBefore() {
        return notEmptyDate(this._dateBefore);
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
            dateAfter: dateAfter,
            dateBefore: dateBefore,
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
            dateAfter,
            dateBefore,
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
        this._dateAfter = '';
        this._dateBefore = '';
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

class PeopleModuleConfig extends AbstractModuleConfig {
    _hasPeople: boolean;
    get hasPeople() {
        return this._hasPeople;
    }
    _count: FormRange;
    get minPeople() {
        return notNullNumber(this._count.min);
    }
    get maxPeople() {
        return notNullNumber(this._count.max);
    }

    get allConfig() {
        const { name, hasPeople, minPeople, maxPeople } = this;
        const obj = {
            name,
            hasPeople,
            ...(hasPeople && {
                minPeople,
                maxPeople
            }),
        };
        Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
        return obj;
    }
    constructor() {
        super('people');
        this._hasPeople = false;
        this._count = new FormRange();
    }
}

export function isPeopleConfig(config: AbstractModuleConfig): config is PeopleModuleConfig {
    return config.name === 'people';
}

const array = [
    ['text', new TextModuleConfig()],
    ['metadata', new MetadataModuleConfig()],
    ['weather', new WeatherModuleConfig()],
    ['people', new PeopleModuleConfig()]
    /*
    ['another module', new AnotherModuleConfig()],
    */
] as [string, AbstractModuleConfig][];
export default array.reduce((acc, [name, config]) => {
    acc[name] = config;
    return acc;
}, {} as Record<string, AbstractModuleConfig>);
