import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeOrderServiceRoutingModule } from './type-order-service-routing.module';
import { TypeOrderServiceListComponent } from './type-order-service-list/type-order-service-list.component';
import { TypeOrderServiceFormComponent } from './type-order-service-form/type-order-service-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    TypeOrderServiceListComponent,
    TypeOrderServiceFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeOrderServiceRoutingModule
  ]
})
export class TypeOrderServiceModule { }
