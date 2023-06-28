import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ElectronicSignatureRoutingModule } from './electronic-signature-routing.module';
import { ElectronicSignatureComponent } from './electronic-signature/electronic-signature.component';
import { UploadDictamenElectronicModalComponent } from './upload-dictamen-files-modal/upload-dictamen-files-modal.component';

@NgModule({
  declarations: [
    ElectronicSignatureComponent,
    UploadDictamenElectronicModalComponent,
  ],
  imports: [CommonModule, ElectronicSignatureRoutingModule, SharedModule],
})
export class ElectronicSignatureModule {}
