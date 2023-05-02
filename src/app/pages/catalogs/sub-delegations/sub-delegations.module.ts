import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubDelegationFormComponent } from './sub-delegation-form/sub-delegation-form.component';
import { SubDelegationListComponent } from './sub-delegation-list/sub-delegation-list.component';
import { SubDelegationsRoutingModule } from './sub-delegations-routing.module';

@NgModule({
  declarations: [SubDelegationListComponent, SubDelegationFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    SubDelegationsRoutingModule,
  ],
})
export class SubDelegationsModule {}
