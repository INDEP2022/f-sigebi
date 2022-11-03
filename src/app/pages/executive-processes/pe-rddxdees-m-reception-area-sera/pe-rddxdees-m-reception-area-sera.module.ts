import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { PeRddxdeesCReceptionAreaSeraComponent } from './pe-rddxdees-c-reception-area-sera/pe-rddxdees-c-reception-area-sera.component';
import { PeRddxdeesMReceptionAreaSeraRoutingModule } from './pe-rddxdees-m-reception-area-sera-routing.module';

@NgModule({
  declarations: [PeRddxdeesCReceptionAreaSeraComponent],
  imports: [
    CommonModule,
    PeRddxdeesMReceptionAreaSeraRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class PeRddxdeesMReceptionAreaSeraModule {}
