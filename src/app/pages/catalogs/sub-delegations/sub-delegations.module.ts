import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubDelegationsRoutingModule } from './sub-delegations-routing.module';
import { SubDelegationListComponent } from './sub-delegation-list/sub-delegation-list.component';
import { SubDelegationFormComponent } from './sub-delegation-form/sub-delegation-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SubDelegationListComponent, SubDelegationFormComponent],
  imports: [CommonModule, SharedModule, SubDelegationsRoutingModule],
})
export class SubDelegationsModule {}
