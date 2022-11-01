import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PeRddgDrpadCTotaldocReceivedDestinationareaComponent } from './pe-rddg-drpad-c-totaldoc-received-destinationarea/pe-rddg-drpad-c-totaldoc-received-destinationarea.component';
import { PeRddgDrpadMTotaldocReceivedDestinationareaRoutingModule } from './pe-rddg-drpad-m-totaldoc-received-destinationarea-routing.module';

@NgModule({
  declarations: [PeRddgDrpadCTotaldocReceivedDestinationareaComponent],
  imports: [
    CommonModule,
    PeRddgDrpadMTotaldocReceivedDestinationareaRoutingModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class PeRddgDrpadMTotaldocReceivedDestinationareaModule {}
