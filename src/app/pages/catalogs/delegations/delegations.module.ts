import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DelegationsRoutingModule } from './delegations-routing.module';
import { DelegationListComponent } from './delegation-list/delegation-list.component';
import { DelegationFormComponent } from './delegation-form/delegation-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [DelegationListComponent, DelegationFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    DelegationsRoutingModule,
  ],
})
export class DelegationsModule {}
