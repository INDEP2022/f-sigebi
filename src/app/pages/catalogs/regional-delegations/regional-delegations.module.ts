import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionalDelegationsRoutingModule } from './regional-delegations-routing.module';
import { RegionalDelegationsListComponent } from './regional-delegations-list/regional-delegations-list.component';
import { RegionalDelegationFormComponent } from './regional-delegation-form/regional-delegation-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';

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
  providers: [RegionalDelegationService],
})
export class RegionalDelegationsModule {}
