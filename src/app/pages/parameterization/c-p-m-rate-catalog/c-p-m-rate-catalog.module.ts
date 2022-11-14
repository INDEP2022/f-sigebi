import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMRateCatalogRoutingModule } from './c-p-m-rate-catalog-routing.module';
import { CPRcCRateCatalogComponent } from './c-p-rc-c-rate-catalog/c-p-rc-c-rate-catalog.component';
import { ModalRatesCatalogComponent } from './modal-rates-catalog/modal-rates-catalog.component';

@NgModule({
  declarations: [CPRcCRateCatalogComponent, ModalRatesCatalogComponent],
  imports: [
    CommonModule,
    CPMRateCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMRateCatalogModule {}
