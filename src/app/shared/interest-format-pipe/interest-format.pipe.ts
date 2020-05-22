// Angular
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'interestFormat'
})
@Injectable()
export class InterestFormatPipe implements PipeTransform {
    transform(item: string): string {
        if (!item) {
            return 'No common interests';
        }

        return item.charAt(0).toUpperCase() + item.slice(1);
    }
}
