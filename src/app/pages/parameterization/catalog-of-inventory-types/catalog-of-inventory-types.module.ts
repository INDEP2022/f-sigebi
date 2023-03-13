import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogOfInventoryTypesRoutingModule } from './catalog-of-inventory-types-routing.module';
import { CatalogOfInventoryTypesComponent } from './catalog-of-inventory-types/catalog-of-inventory-types.component';
import { ListTypeOfInventoryComponent } from './list-type-of-inventory/list-type-of-inventory.component';
import { ModalCatalogOfInventoryTypesComponent } from './modal-catalog-of-inventory-types/modal-catalog-of-inventory-types.component';

@NgModule({
  declarations: [
    CatalogOfInventoryTypesComponent,
    ModalCatalogOfInventoryTypesComponent,
    ListTypeOfInventoryComponent,
  ],
  imports: [
    CommonModule,
    CatalogOfInventoryTypesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatalogOfInventoryTypesModule {}
