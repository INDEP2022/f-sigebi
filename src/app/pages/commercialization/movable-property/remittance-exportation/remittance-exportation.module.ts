import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { RemittanceExportationRoutingModule } from './remittance-exportation-routing.module';
import { RemittanceExportationComponent } from './remittance-exportation/remittance-exportation.component';

@NgModule({
  declarations: [RemittanceExportationComponent],
  imports: [
    CommonModule,
    RemittanceExportationRoutingModule,
    SharedModule,
    EventTypeSharedComponent,
  ],
})
export class RemittanceExportationModule {}
