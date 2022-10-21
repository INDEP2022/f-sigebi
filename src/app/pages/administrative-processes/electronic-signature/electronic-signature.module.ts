import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ElectronicSignatureRoutingModule } from './electronic-signature-routing.module';
import { ElectronicSignatureComponent } from './electronic-signature/electronic-signature.component';

@NgModule({
  declarations: [ElectronicSignatureComponent],
  imports: [CommonModule, ElectronicSignatureRoutingModule, SharedModule],
})
export class ElectronicSignatureModule {}
