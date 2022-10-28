import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';

import { CBmRExdlrMRemittanceExportationRoutingModule } from './c-bm-r-exdlr-m-remittance-exportation-routing.module';
import { CBmRExdlrCRemittanceExportationComponent } from './c-bm-r-exdlr-c-remittance-exportation/c-bm-r-exdlr-c-remittance-exportation.component';


@NgModule({
  declarations: [
    CBmRExdlrCRemittanceExportationComponent
  ],
  imports: [
    CommonModule,
    CBmRExdlrMRemittanceExportationRoutingModule,
    SharedModule,
    EventTypeSharedComponent
  ]
})
export class CBmRExdlrMRemittanceExportationModule { }
