import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesListComponent } from './warehouses-list/warehouses-list.component';
import { WarehousesDetailComponent } from './warehouses-detail/warehouses-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

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
