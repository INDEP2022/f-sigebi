import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { WarehousesDetailComponent } from './warehouses-detail/warehouses-detail.component';
import { WarehousesListComponent } from './warehouses-list/warehouses-list.component';
import { WarehousesRoutingModule } from './warehouses-routing.module';

@NgModule({
  declarations: [WarehousesListComponent, WarehousesDetailComponent],
  imports: [
    CommonModule,
    WarehousesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class WarehousesModule {}
