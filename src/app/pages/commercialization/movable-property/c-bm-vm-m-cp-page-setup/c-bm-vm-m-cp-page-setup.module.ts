import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module'; 
import { ModalModule } from 'ngx-bootstrap/modal';

import { CBmVmMCpPageSetupRoutingModule } from './c-bm-vm-m-cp-page-setup-routing.module';
import { CBmVmCCpPageSetupComponent } from './c-bm-vm-c-cp-page-setup/c-bm-vm-c-cp-page-setup.component';
import { CBmVmCCpPageSetupModalComponent } from './c-bm-vm-c-cp-page-setup-modal/c-bm-vm-c-cp-page-setup-modal.component';


@NgModule({
  declarations: [
    CBmVmCCpPageSetupComponent,
    CBmVmCCpPageSetupModalComponent
  ],
  imports: [
    CommonModule,
    CBmVmMCpPageSetupRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class CBmVmMCpPageSetupModule { }
