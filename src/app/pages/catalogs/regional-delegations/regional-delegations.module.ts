import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegionalDelegationFormComponent } from './regional-delegation-form/regional-delegation-form.component';
import { RegionalDelegationsListComponent } from './regional-delegations-list/regional-delegations-list.component';
import { RegionalDelegationsRoutingModule } from './regional-delegations-routing.module';

@NgModule({
  declarations: [
    RegionalDelegationsListComponent,
    RegionalDelegationFormComponent,
  ],
  imports: [
    CommonModule,
    RegionalDelegationsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RegionalDelegationsModule {}
