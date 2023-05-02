import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DetailDelegationFormComponent } from './detail-delegation-form/detail-delegation-form.component';
import { DetailDelegationListComponent } from './detail-delegation-list/detail-delegation-list.component';
import { DetailDelegationRoutingModule } from './detail-delegation-routing.module';

@NgModule({
  declarations: [DetailDelegationListComponent, DetailDelegationFormComponent],
  imports: [
    CommonModule,
    DetailDelegationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DetailDelegationModule {}
