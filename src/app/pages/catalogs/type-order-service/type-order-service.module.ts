import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { TypeOrderServiceFormComponent } from './type-order-service-form/type-order-service-form.component';
import { TypeOrderServiceListComponent } from './type-order-service-list/type-order-service-list.component';
import { TypeOrderServiceRoutingModule } from './type-order-service-routing.module';

@NgModule({
  declarations: [TypeOrderServiceListComponent, TypeOrderServiceFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeOrderServiceRoutingModule,
  ],
})
export class TypeOrderServiceModule {}
