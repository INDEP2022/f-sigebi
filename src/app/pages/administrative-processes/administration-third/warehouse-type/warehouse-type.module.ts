import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { WarehouseTypeModalComponent } from './warehouse-type-modal/warehouse-type-modal.component';
import { WarehouseTypeRoutingModule } from './warehouse-type-routing.module';
import { WarehouseTypeComponent } from './warehouse-type/warehouse-type.component';

@NgModule({
  declarations: [WarehouseTypeComponent, WarehouseTypeModalComponent],
  imports: [
    CommonModule,
    WarehouseTypeRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class WarehouseTypeModule {}
