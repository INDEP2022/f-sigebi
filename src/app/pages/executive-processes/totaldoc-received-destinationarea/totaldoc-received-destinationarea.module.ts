import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TotaldocReceivedDestinationareaRoutingModule } from './totaldoc-received-destinationarea-routing.module';
import { TotaldocReceivedDestinationareaComponent } from './totaldoc-received-destinationarea/totaldoc-received-destinationarea.component';

@NgModule({
  declarations: [TotaldocReceivedDestinationareaComponent],
  imports: [
    CommonModule,
    TotaldocReceivedDestinationareaRoutingModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class TotaldocReceivedDestinationareaModule {}
