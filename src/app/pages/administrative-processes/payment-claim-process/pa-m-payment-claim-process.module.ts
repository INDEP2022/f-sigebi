import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaMPaymentClaimProcessRoutingModule } from './pa-m-payment-claim-process-routing.module';
import { ModalJustifier } from './pa-pcp-c-payment-claim-process/modal-justifier.component';
import { PaPcpCPaymentClaimProcessComponent } from './pa-pcp-c-payment-claim-process/pa-pcp-c-payment-claim-process.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [
    PaPcpCPaymentClaimProcessComponent,
    ScanningFoilComponent,
    ModalJustifier,
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMPaymentClaimProcessRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
  ],
})
export class PaMPaymentClaimProcessModule {}
