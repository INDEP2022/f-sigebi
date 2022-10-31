import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    WarehousesComponent
  ],
  imports: [
    CommonModule,
    WarehousesRoutingModule,
    SharedModule
  ]
})
export class WarehousesModule { }
