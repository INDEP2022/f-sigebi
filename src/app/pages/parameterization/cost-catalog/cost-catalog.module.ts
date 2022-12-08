import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { CostCatalogRoutingModule } from './cost-catalog-routing.module';
import { CostCatalogComponent } from './cost-catalog/cost-catalog.component';
import { ModalCostCatalogComponent } from './modal-cost-catalog/modal-cost-catalog.component';

@NgModule({
  declarations: [CostCatalogComponent, ModalCostCatalogComponent],
  imports: [
    CommonModule,
    CostCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CostCatalogModule {}
