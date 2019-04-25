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
                result = 'Movies/TV. What have you guys been watching on Netflix?'
                break;
            case 'music':
                result = 'Music. Rock out Prater!'
                break;
            case 'gaming':
                result = 'Gaming. PC > Console, right?'
                break;
            case 'books':
                result = 'Books. What yall been reading son?'
                break;
            case 'education':
                result = 'Education. Nerd it up.'
                break;
            case 'sports':
                result = 'Sports. Manly men stuff. Go throw a ball for all I care.'
                break;
            case 'life':
                result = 'Life. It just got deep.'
                break;
            case 'dating':
                result = 'Dating ;).'
                break;
            default:
                result = 'no common interests. Just chat about anything!'
        }

        return result;
    }
}
