import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CPMValuesRoutingModule } from './c-p-m-values-routing.module';
import { CPMValuesComponent } from './c-p-m-values/c-p-m-values.component';
import { CPMValuesModalComponent } from './c-p-m-values-modal/c-p-m-values-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    CPMValuesComponent,
    CPMValuesModalComponent
  ],
  imports: [
    CommonModule,
    CPMValuesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class CPMValuesModule { }
