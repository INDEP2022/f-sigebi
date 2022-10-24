import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { GenericsFormComponent } from './generics-form/generics-form.component';
import { GenericsListComponent } from './generics-list/generics-list.component';
import { GenericsRoutingModule } from './generics-routing.module';

@NgModule({
  declarations: [GenericsFormComponent, GenericsListComponent],
  imports: [
    CommonModule,
    GenericsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class GenericsModule {}
