import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StrategyCostComponent } from './strategy-cost/strategy-cost.component';
import { TypeGoodComponent } from './type-good/type-good.component';
import { WarehouseTypeModalComponent } from './warehouse-type-modal/warehouse-type-modal.component';
import { WarehouseTypeModalsComponent } from './warehouse-type-modals/warehouse-type-modals.component';
import { WarehouseTypeRoutingModule } from './warehouse-type-routing.module';
import { WarehouseTypeComponent } from './warehouse-type/warehouse-type.component';

@NgModule({
  declarations: [
    WarehouseTypeComponent,
    WarehouseTypeModalComponent,
    WarehouseTypeModalsComponent,
    StrategyCostComponent,
    TypeGoodComponent,
  ],
  imports: [
    CommonModule,
    WarehouseTypeRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class WarehouseTypeModule {}
