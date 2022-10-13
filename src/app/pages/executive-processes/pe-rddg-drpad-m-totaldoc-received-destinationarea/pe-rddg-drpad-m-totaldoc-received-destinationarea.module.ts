import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';

import { PeRddgDrpadMTotaldocReceivedDestinationareaRoutingModule } from './pe-rddg-drpad-m-totaldoc-received-destinationarea-routing.module';
import { PeRddgDrpadCTotaldocReceivedDestinationareaComponent } from './pe-rddg-drpad-c-totaldoc-received-destinationarea/pe-rddg-drpad-c-totaldoc-received-destinationarea.component';

@NgModule({
  declarations: [PeRddgDrpadCTotaldocReceivedDestinationareaComponent],
  imports: [
    CommonModule,
    PeRddgDrpadMTotaldocReceivedDestinationareaRoutingModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
  ],
})
export class PeRddgDrpadMTotaldocReceivedDestinationareaModule {}
