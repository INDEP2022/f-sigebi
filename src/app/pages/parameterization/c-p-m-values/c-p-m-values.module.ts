import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMValuesModalComponent } from './c-p-m-values-modal/c-p-m-values-modal.component';
import { CPMValuesRoutingModule } from './c-p-m-values-routing.module';
import { CPMValuesComponent } from './c-p-m-values/c-p-m-values.component';

@NgModule({
  declarations: [CPMValuesComponent, CPMValuesModalComponent],
  imports: [
    CommonModule,
    CPMValuesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMValuesModule {}
