import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCtCCatalogOfTransferorsComponent } from './c-p-ct-c-catalog-of-transferors/c-p-ct-c-catalog-of-transferors.component';
import { CPMCatalogOfTransferorsRoutingModule } from './c-p-m-catalog-of-transferors-routing.module';
import { ModalCatalogOfTransferorsComponent } from './modal-catalog-of-transferors/modal-catalog-of-transferors.component';

@NgModule({
  declarations: [
    CPCtCCatalogOfTransferorsComponent,
    ModalCatalogOfTransferorsComponent,
  ],
  imports: [
    CommonModule,
    CPMCatalogOfTransferorsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatalogOfTransferorsModule {}
