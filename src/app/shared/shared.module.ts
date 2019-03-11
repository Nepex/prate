import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from './header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule, 
        NgbModule
    ],
    exports: [HeaderComponent],
    providers: [],
})
export class SharedModule { }