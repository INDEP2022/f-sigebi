import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { StoreHouseRoutingModule } from './store-house-routing.module';
import { StorehouseDetailComponent } from './storehouse-detail/storehouse-detail.component';
import { StorehouseListComponent } from './storehouse-list/storehouse-list.component';

@NgModule({
  declarations: [StorehouseListComponent, StorehouseDetailComponent],
  imports: [
    CommonModule,
    StoreHouseRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class StoreHouseModule {}
