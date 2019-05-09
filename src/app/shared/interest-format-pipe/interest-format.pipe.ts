import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'interestFormat'
})
@Injectable()
export class InterestFormatPipe implements PipeTransform {
    transform(item: string): string {
        let result = null;

        switch (item) {
            case 'movies/tv':
                result = 'Movies/TV'
                break;
            case 'music':
                result = 'Music'
                break;
            case 'gaming':
                result = 'Gaming'
                break;
            case 'books':
                result = 'Books'
                break;
            case 'education':
                result = 'Education'
                break;
            case 'sports':
                result = 'Sports'
                break;
            case 'life':
                result = 'Life'
                break;
            case 'dating':
                result = 'Dating ;)'
                break;
            default:
                result = 'No common interests'
        }

        return result;
    }
}
