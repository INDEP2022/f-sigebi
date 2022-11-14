import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CentralOfficesTransferenceRoutingModule } from './central-offices-transference-routing.module';
import { CentralOfficesTransferenceComponent } from './central-offices-transference/central-offices-transference.component';

@NgModule({
  declarations: [CentralOfficesTransferenceComponent],
  imports: [
    CommonModule,
    CentralOfficesTransferenceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CentralOfficesTransferenceModule {}
