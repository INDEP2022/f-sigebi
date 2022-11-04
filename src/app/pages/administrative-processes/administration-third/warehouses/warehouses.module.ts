import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesComponent } from './warehouses/warehouses.component';

@NgModule({
  declarations: [WarehousesComponent],
  imports: [CommonModule, WarehousesRoutingModule, SharedModule],
})
export class WarehousesModule {}
