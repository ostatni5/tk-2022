import { parseExifDate } from '../../utils/metadata.utils';
import MetadataOptions from './metadataOptions';

export function filterRange(value?: any, filterFrom?: any, filterTo?: any): boolean{
    if ((filterFrom != null || filterTo != null) && value == null) return false;

    if (filterFrom != null && value < filterFrom) return false;

    if (filterTo != null && value > filterTo) return false;

    return true;
}

export function filterValue(value?: any, filterOption?: any): boolean{
    if(filterOption == null) return true;
    
    if(value == null) return false;

    return value === filterOption;
}
