import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module'; 

import { CBmVmMCpPageSetupRoutingModule } from './c-bm-vm-m-cp-page-setup-routing.module';
import { CBmVmCCpPageSetupComponent } from './c-bm-vm-c-cp-page-setup/c-bm-vm-c-cp-page-setup.component';


@NgModule({
  declarations: [
    CBmVmCCpPageSetupComponent
  ],
  imports: [
    CommonModule,
    CBmVmMCpPageSetupRoutingModule,
    SharedModule
  ]
})
export class CBmVmMCpPageSetupModule { }
