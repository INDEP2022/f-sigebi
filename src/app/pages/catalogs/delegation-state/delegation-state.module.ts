import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DelegationStateRoutingModule } from './delegation-state-routing.module';
import { DelegationStateListComponent } from './delegation-state-list/delegation-state-list.component';
import { DelegationStateFormComponent } from './delegation-state-form/delegation-state-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
