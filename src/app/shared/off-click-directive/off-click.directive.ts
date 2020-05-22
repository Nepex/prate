// Angular
import { Directive, Output, EventEmitter, ElementRef } from '@angular/core';

@Directive({
    selector: '[offClick]',
    host: {
        '(document:click)': 'onClick($event)',
    }
})

export class OffClickDirective {
    @Output('offClick')
    offClicked = new EventEmitter();

    constructor(private elementRef: ElementRef) {
    }

    onClick($event): void {
        $event.stopPropagation();

        if (!this.elementRef.nativeElement.contains($event.target))
            this.offClicked.emit({});
    }
}