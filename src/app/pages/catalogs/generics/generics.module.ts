import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { GenericsRoutingModule } from './generics-routing.module';
import { GenericsFormComponent } from './generics-form/generics-form.component';
import { GenericsListComponent } from './generics-list/generics-list.component';

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
