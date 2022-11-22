import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPCitCCatalogOfInventoryTypesComponent } from './c-p-cit-c-catalog-of-inventory-types/c-p-cit-c-catalog-of-inventory-types.component';
import { CPMCatalogOfInventoryTypesRoutingModule } from './c-p-m-catalog-of-inventory-types-routing.module';
import { ModalCatalogOfInventoryTypesComponent } from './modal-catalog-of-inventory-types/modal-catalog-of-inventory-types.component';

@NgModule({
  declarations: [
    CPCitCCatalogOfInventoryTypesComponent,
    ModalCatalogOfInventoryTypesComponent,
  ],
  imports: [
    CommonModule,
    CPMCatalogOfInventoryTypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatalogOfInventoryTypesModule {}
