import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationStateFormComponent } from './delegation-state-form/delegation-state-form.component';
import { DelegationStateListComponent } from './delegation-state-list/delegation-state-list.component';
import { DelegationStateRoutingModule } from './delegation-state-routing.module';

@NgModule({
  declarations: [DelegationStateListComponent, DelegationStateFormComponent],
  imports: [
    CommonModule,
    DelegationStateRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DelegationStateModule {}
