import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { TypeWharehouseFromComponent } from './type-wharehouse-from/type-wharehouse-from.component';
import { TypeWharehouseListComponent } from './type-wharehouse-list/type-wharehouse-list.component';
import { TypeWharehouseRoutingModule } from './type-wharehouse-routing.module';

@NgModule({
  declarations: [TypeWharehouseListComponent, TypeWharehouseFromComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeWharehouseRoutingModule,
  ],
})
export class TypeWharehouseModule {}
