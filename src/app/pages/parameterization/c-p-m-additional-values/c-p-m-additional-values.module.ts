import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CPMAdditionalValuesRoutingModule } from './c-p-m-additional-values-routing.module';
import { CPMAdditionalValuesComponent } from './c-p-m-additional-values/c-p-m-additional-values.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CPMAdditionalValuesModalComponent } from './c-p-m-additional-values-modal/c-p-m-additional-values-modal.component';


@NgModule({
  declarations: [
    CPMAdditionalValuesComponent,
    CPMAdditionalValuesModalComponent
  ],
  imports: [
    CommonModule,
    CPMAdditionalValuesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class CPMAdditionalValuesModule { }
