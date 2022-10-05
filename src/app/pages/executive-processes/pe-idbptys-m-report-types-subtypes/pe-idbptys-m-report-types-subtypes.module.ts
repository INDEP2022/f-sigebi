import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeIdbptysMReportTypesSubtypesRoutingModule } from './pe-idbptys-m-report-types-subtypes-routing.module';
import { PeIdbptysCReportTypesSubtypesComponent } from './pe-idbptys-c-report-types-subtypes/pe-idbptys-c-report-types-subtypes.component';


@NgModule({
  declarations: [
    PeIdbptysCReportTypesSubtypesComponent
  ],
  imports: [
    CommonModule,
    PeIdbptysMReportTypesSubtypesRoutingModule
  ]
})
export class PeIdbptysMReportTypesSubtypesModule { }
