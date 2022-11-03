import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PeGdaddCDocReceivedSeraComponent } from './pe-gdadd-c-doc-received-sera/pe-gdadd-c-doc-received-sera.component';
import { PeGdaddMDocReceivedSeraRoutingModule } from './pe-gdadd-m-doc-received-sera-routing.module';

@NgModule({
  declarations: [PeGdaddCDocReceivedSeraComponent],
  imports: [
    CommonModule,
    PeGdaddMDocReceivedSeraRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class PeGdaddMDocReceivedSeraModule {}
