import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdditionalValuesModalComponent } from './additional-values-modal/additional-values-modal.component';
import { AdditionalValuesRoutingModule } from './additional-values-routing.module';
import { AdditionalValuesComponent } from './additional-values/additional-values.component';

@NgModule({
  declarations: [AdditionalValuesComponent, AdditionalValuesModalComponent],
  imports: [
    CommonModule,
    AdditionalValuesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class AdditionalValuesModule {}
