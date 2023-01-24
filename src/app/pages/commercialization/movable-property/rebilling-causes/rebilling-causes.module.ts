import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { RebillingCausesModalComponent } from './rebilling-causes-modal/rebilling-causes-modal.component';
import { RebillingCausesRoutingModule } from './rebilling-causes-routing.module';
import { RebillingCausesComponent } from './rebilling-causes/rebilling-causes.component';

@NgModule({
  declarations: [RebillingCausesComponent, RebillingCausesModalComponent],
  imports: [
    CommonModule,
    RebillingCausesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RebillingCausesModule {}
