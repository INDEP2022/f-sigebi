import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBmVmCCpPageSetupModalComponent } from './c-bm-vm-c-cp-page-setup-modal/c-bm-vm-c-cp-page-setup-modal.component';
import { CBmVmCCpPageSetupComponent } from './c-bm-vm-c-cp-page-setup/c-bm-vm-c-cp-page-setup.component';
import { CBmVmMCpPageSetupRoutingModule } from './c-bm-vm-m-cp-page-setup-routing.module';

@NgModule({
  declarations: [CBmVmCCpPageSetupComponent, CBmVmCCpPageSetupModalComponent],
  imports: [
    CommonModule,
    CBmVmMCpPageSetupRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CBmVmMCpPageSetupModule {}
