import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreHouseRoutingModule } from './store-house-routing.module';
import { StorehouseListComponent } from './storehouse-list/storehouse-list.component';
import { StorehouseDetailComponent } from './storehouse-detail/storehouse-detail.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

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
