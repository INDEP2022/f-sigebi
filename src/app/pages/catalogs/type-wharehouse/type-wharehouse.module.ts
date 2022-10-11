import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeWharehouseRoutingModule } from './type-wharehouse-routing.module';
import { TypeWharehouseListComponent } from './type-wharehouse-list/type-wharehouse-list.component';
import { TypeWharehouseFromComponent } from './type-wharehouse-from/type-wharehouse-from.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    TypeWharehouseListComponent,
    TypeWharehouseFromComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeWharehouseRoutingModule
  ]
})
export class TypeWharehouseModule { }
