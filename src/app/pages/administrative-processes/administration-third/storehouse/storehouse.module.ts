import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorehouseRoutingModule } from './storehouse-routing.module';
import { StorehouseComponent } from './storehouse/storehouse.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    StorehouseComponent
  ],
  imports: [
    CommonModule,
    StorehouseRoutingModule,
    SharedModule
  ]
})
export class StorehouseModule { }
