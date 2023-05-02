import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { TypeServicesFormComponent } from './type-services-form/type-services-form.component';
import { TypeServicesListComponent } from './type-services-list/type-services-list.component';
import { TypeServicesRoutingModule } from './type-services-routing.module';

@NgModule({
  declarations: [TypeServicesListComponent, TypeServicesFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    TypeServicesRoutingModule,
  ],
})
export class TypeServicesModule {}
