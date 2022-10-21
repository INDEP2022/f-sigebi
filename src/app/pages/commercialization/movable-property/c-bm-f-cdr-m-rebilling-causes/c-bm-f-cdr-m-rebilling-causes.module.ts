import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBmFCdrCRebillingCausesModalComponent } from './c-bm-f-cdr-c-rebilling-causes-modal/c-bm-f-cdr-c-rebilling-causes-modal.component';
import { CBmFCdrCRebillingCausesComponent } from './c-bm-f-cdr-c-rebilling-causes/c-bm-f-cdr-c-rebilling-causes.component';
import { CBmFCdrMRebillingCausesRoutingModule } from './c-bm-f-cdr-m-rebilling-causes-routing.module';

@NgModule({
  declarations: [
    CBmFCdrCRebillingCausesComponent,
    CBmFCdrCRebillingCausesModalComponent,
  ],
  imports: [
    CommonModule,
    CBmFCdrMRebillingCausesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CBmFCdrMRebillingCausesModule {}
