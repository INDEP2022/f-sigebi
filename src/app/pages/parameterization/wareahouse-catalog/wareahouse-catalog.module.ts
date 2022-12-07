import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { WareahouseCatalogRoutingModule } from './wareahouse-catalog-routing.module';
import { WareahouseCatalogComponent } from './wareahouse-catalog/wareahouse-catalog.component';

@NgModule({
  declarations: [WareahouseCatalogComponent],
  imports: [
    CommonModule,
    WareahouseCatalogRoutingModule,
    SharedModule,
    WarehouseSharedComponent,
  ],
})
export class WareahouseCatalogModule {}
