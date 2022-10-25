import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationFormComponent } from './delegation-form/delegation-form.component';
import { DelegationListComponent } from './delegation-list/delegation-list.component';
import { DelegationsRoutingModule } from './delegations-routing.module';

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
