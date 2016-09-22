import {Pipe, PipeTransform} from '@angular/core';
 
@Pipe({ name: 'padLeft' })
export class PadLeftPipe implements PipeTransform {
    transform(value: string, pad: string): string {
        let str = value ? value : "";

        let result = pad.substring(0, pad.length - str.length) + str;
        return result;
    }
}