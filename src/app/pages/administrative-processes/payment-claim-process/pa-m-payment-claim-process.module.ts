import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { PaMPaymentClaimProcessRoutingModule } from './pa-m-payment-claim-process-routing.module';
import { PaPcpCPaymentClaimProcessComponent } from './pa-pcp-c-payment-claim-process/pa-pcp-c-payment-claim-process.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';
import { ModalJustifier } from './pa-pcp-c-payment-claim-process/modal-justifier.component';
import { PaPcpCLegalRegularizationComponent } from './pa-pcp-c-legal-regularization/pa-pcp-c-legal-regularization.component';

@NgModule({
  declarations: [
    PaPcpCPaymentClaimProcessComponent,
    ScanningFoilComponent,
    ModalJustifier,
    PaPcpCLegalRegularizationComponent,
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
