import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPCcCostCatalogComponent } from './c-p-cc-cost-catalog/c-p-cc-cost-catalog.component';
import { CPMCostCatalogRoutingModule } from './c-p-m-cost-catalog-routing.module';
import { ModalCostCatalogComponent } from './modal-cost-catalog/modal-cost-catalog.component';

@NgModule({
  declarations: [CPCcCostCatalogComponent, ModalCostCatalogComponent],
  imports: [
    CommonModule,
    CPMCostCatalogRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCostCatalogModule {}
