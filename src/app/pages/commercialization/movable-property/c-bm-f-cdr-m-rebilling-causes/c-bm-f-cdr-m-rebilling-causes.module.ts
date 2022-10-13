import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CBmFCdrMRebillingCausesRoutingModule } from './c-bm-f-cdr-m-rebilling-causes-routing.module';
import { CBmFCdrCRebillingCausesComponent } from './c-bm-f-cdr-c-rebilling-causes/c-bm-f-cdr-c-rebilling-causes.component';
import { CBmFCdrCRebillingCausesModalComponent } from './c-bm-f-cdr-c-rebilling-causes-modal/c-bm-f-cdr-c-rebilling-causes-modal.component';


@NgModule({
  declarations: [
    CBmFCdrCRebillingCausesComponent,
    CBmFCdrCRebillingCausesModalComponent
  ],
  imports: [
    CommonModule,
    CBmFCdrMRebillingCausesRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class CBmFCdrMRebillingCausesModule { }
