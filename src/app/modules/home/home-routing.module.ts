// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App
import { AttributionsComponent } from './attributions/attributions.component';
import { ChangeLogComponent } from './change-log/change-log.component';
import { DevelopersComponent } from './developers/developers.component';
import { DownloadComponent } from './download/download.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SummaryComponent } from './summary/summary.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: LandingPageComponent },
    { path: 'attributions', component: AttributionsComponent },
    { path: 'changelog', component: ChangeLogComponent },
    { path: 'developers', component: DevelopersComponent },
    { path: 'download', component: DownloadComponent },
    { path: 'summary', component: SummaryComponent },
];

// Module for Home routing
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule { }
