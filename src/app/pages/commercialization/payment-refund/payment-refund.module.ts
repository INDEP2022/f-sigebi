import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeRfcModalComponent } from './payment-refund-main/change-rfc-modal/change-rfc-modal.component';
import { CheckPermissionsNonWinnersComponent } from './payment-refund-main/components/check-permissions-non-winners/check-permissions-non-winners.component';
import { CheckPermissionsWinnersComponent } from './payment-refund-main/components/check-permissions-winners/check-permissions-winners.component';
import { CheckValidKeyComponent } from './payment-refund-main/components/check-valid-key/check-valid-key.component';
import { CreateControlModalComponent } from './payment-refund-main/create-control-modal/create-control-modal.component';
import { CreationPermissionsModalComponent } from './payment-refund-main/creation-permissions-modal/creation-permissions-modal.component';
import { ExpensesRequestModalComponent } from './payment-refund-main/expenses-request-modal/expenses-request-modal.component';
import { ExpensesRequestComponent } from './payment-refund-main/expenses-request/expenses-request.component';
import { KeyChangeModalComponent } from './payment-refund-main/key-change-modal/key-change-modal.component';
import { LayoutMaintenanceModalComponent } from './payment-refund-main/layout-maintenance-modal/layout-maintenance-modal.component';
import { LayoutMaintenanceStructureModalComponent } from './payment-refund-main/layout-maintenance-structure-modal/layout-maintenance-structure-modal.component';
import { LayoutMaintenanceComponent } from './payment-refund-main/layout-maintenance/layout-maintenance.component';
import { PaymentRefundMainComponent } from './payment-refund-main/payment-refund-main.component';
import { TableCheckComponent } from './payment-refund-main/table-check/table-check.component';
import { TransferDateModalComponent } from './payment-refund-main/transfer-date-modal/transfer-date-modal.component';
import { PaymentRefundRoutingModule } from './payment-refund-routing.module';

@NgModule({
  declarations: [
    PaymentRefundMainComponent,
    CreateControlModalComponent,
    CreationPermissionsModalComponent,
    KeyChangeModalComponent,
    TransferDateModalComponent,
    LayoutMaintenanceComponent,
    ExpensesRequestComponent,
    ExpensesRequestModalComponent,
    LayoutMaintenanceModalComponent,
    LayoutMaintenanceStructureModalComponent,
    TableCheckComponent,
    CheckPermissionsWinnersComponent,
    CheckPermissionsNonWinnersComponent,
    ChangeRfcModalComponent,
    CheckValidKeyComponent,
  ],
  imports: [
    CommonModule,
    PaymentRefundRoutingModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgScrollbarModule,
  ],
})
export class PaymentRefundModule {}
