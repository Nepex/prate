// Angular
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Pipe, PipeTransform } from '@angular/core';

// Pipe for safely injecting in HTML
@Pipe({
    name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

}