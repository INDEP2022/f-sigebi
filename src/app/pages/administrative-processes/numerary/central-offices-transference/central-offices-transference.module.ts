import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { CentralOfficesTransferenceRoutingModule } from './central-offices-transference-routing.module';
import { CentralOfficesTransferenceComponent } from './central-offices-transference/central-offices-transference.component';
import { EmailComponentC } from './email/email.component';

@NgModule({
  declarations: [CentralOfficesTransferenceComponent, EmailComponentC],
  imports: [
    CommonModule,
    CentralOfficesTransferenceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    FormsModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
  ],
})
export class CentralOfficesTransferenceModule {}
