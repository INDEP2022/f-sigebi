import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IfaiSeriesRoutingModule } from './ifai-series-routing.module';
import { IfaiSeriesListComponent } from './ifai-series-list/ifai-series-list.component';


@NgModule({
  declarations: [
    IfaiSeriesListComponent
  ],
  imports: [
    CommonModule,
    IfaiSeriesRoutingModule
  ]
})
export class IfaiSeriesModule { }
