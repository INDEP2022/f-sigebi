import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeServicesRoutingModule } from './type-services-routing.module';
import { TypeServicesListComponent } from './type-services-list/type-services-list.component';
import { TypeServicesFormComponent } from './type-services-form/type-services-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    TypeServicesListComponent,
    TypeServicesFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeServicesRoutingModule
  ]
})
export class TypeServicesModule { }
