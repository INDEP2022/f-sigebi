import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMAdditionalValuesModalComponent } from './c-p-m-additional-values-modal/c-p-m-additional-values-modal.component';
import { CPMAdditionalValuesRoutingModule } from './c-p-m-additional-values-routing.module';
import { CPMAdditionalValuesComponent } from './c-p-m-additional-values/c-p-m-additional-values.component';

@NgModule({
  declarations: [
    CPMAdditionalValuesComponent,
    CPMAdditionalValuesModalComponent,
  ],
  imports: [
    CommonModule,
    CPMAdditionalValuesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMAdditionalValuesModule {}
