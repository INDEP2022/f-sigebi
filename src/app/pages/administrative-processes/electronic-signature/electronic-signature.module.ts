import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectronicSignatureRoutingModule } from './electronic-signature-routing.module';
import { ElectronicSignatureComponent } from './electronic-signature/electronic-signature.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ElectronicSignatureComponent
  ],
  imports: [
    CommonModule,
    ElectronicSignatureRoutingModule,
    SharedModule
  ]
})
export class ElectronicSignatureModule { }
