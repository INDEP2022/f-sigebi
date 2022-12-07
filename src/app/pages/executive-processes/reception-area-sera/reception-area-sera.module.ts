import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { ReceptionAreaSeraRoutingModule } from './reception-area-sera-routing.module';
import { ReceptionAreaSeraComponent } from './reception-area-sera/reception-area-sera.component';

@NgModule({
  declarations: [ReceptionAreaSeraComponent],
  imports: [
    CommonModule,
    ReceptionAreaSeraRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class ReceptionAreaSeraModule {}
