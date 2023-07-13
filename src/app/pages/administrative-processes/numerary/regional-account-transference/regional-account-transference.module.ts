import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { RegionalAccountTransferenceRoutingModule } from './regional-account-transference-routing.module';
import { RegionalAccountTransferenceComponent } from './regional-account-transference/regional-account-transference.component';

@NgModule({
  declarations: [RegionalAccountTransferenceComponent],
  imports: [
    CommonModule,
    RegionalAccountTransferenceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class RegionalAccountTransferenceModule {}
