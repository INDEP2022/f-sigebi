import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailComponent } from './email/email.component';
import { RegionalAccountTransferenceRoutingModule } from './regional-account-transference-routing.module';
import { RegionalAccountTransferenceComponent } from './regional-account-transference/regional-account-transference.component';

@NgModule({
  declarations: [RegionalAccountTransferenceComponent, EmailComponent],
  imports: [
    CommonModule,
    RegionalAccountTransferenceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormLoaderComponent,
  ],
})
export class RegionalAccountTransferenceModule {}
