import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocReceivedSeraRoutingModule } from './doc-received-sera-routing.module';
import { DocReceivedSeraComponent } from './doc-received-sera/doc-received-sera.component';

@NgModule({
  declarations: [DocReceivedSeraComponent],
  imports: [
    CommonModule,
    DocReceivedSeraRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class DocReceivedSeraModule {}
