import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalRatesCatalogComponent } from './modal-rates-catalog/modal-rates-catalog.component';
import { RateCatalogRoutingModule } from './rate-catalog-routing.module';
import { RateCatalogComponent } from './rate-catalog/rate-catalog.component';

@NgModule({
  declarations: [RateCatalogComponent, ModalRatesCatalogComponent],
  imports: [
    CommonModule,
    RateCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RateCatalogModule {}
