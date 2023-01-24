import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { StorehouseRoutingModule } from './storehouse-routing.module';
import { StorehouseComponent } from './storehouse/storehouse.component';

@NgModule({
  declarations: [StorehouseComponent],
  imports: [CommonModule, StorehouseRoutingModule, SharedModule],
})
export class StorehouseModule {}
