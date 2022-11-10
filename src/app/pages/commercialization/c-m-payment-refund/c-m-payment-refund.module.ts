import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMPaymentRefundMainComponent } from './c-m-payment-refund-main/c-m-payment-refund-main.component';
import { ChangeRfcModalComponent } from './c-m-payment-refund-main/change-rfc-modal/change-rfc-modal.component';
import { CheckPermissionsNonWinnersComponent } from './c-m-payment-refund-main/components/check-permissions-non-winners/check-permissions-non-winners.component';
import { CheckPermissionsWinnersComponent } from './c-m-payment-refund-main/components/check-permissions-winners/check-permissions-winners.component';
import { CheckValidKeyComponent } from './c-m-payment-refund-main/components/check-valid-key/check-valid-key.component';
import { CreateControlModalComponent } from './c-m-payment-refund-main/create-control-modal/create-control-modal.component';
import { CreationPermissionsModalComponent } from './c-m-payment-refund-main/creation-permissions-modal/creation-permissions-modal.component';
import { ExpensesRequestModalComponent } from './c-m-payment-refund-main/expenses-request-modal/expenses-request-modal.component';
import { ExpensesRequestComponent } from './c-m-payment-refund-main/expenses-request/expenses-request.component';
import { KeyChangeModalComponent } from './c-m-payment-refund-main/key-change-modal/key-change-modal.component';
import { LayoutMaintenanceModalComponent } from './c-m-payment-refund-main/layout-maintenance-modal/layout-maintenance-modal.component';
import { LayoutMaintenanceStructureModalComponent } from './c-m-payment-refund-main/layout-maintenance-structure-modal/layout-maintenance-structure-modal.component';
import { LayoutMaintenanceComponent } from './c-m-payment-refund-main/layout-maintenance/layout-maintenance.component';
import { TableCheckComponent } from './c-m-payment-refund-main/table-check/table-check.component';
import { TransferDateModalComponent } from './c-m-payment-refund-main/transfer-date-modal/transfer-date-modal.component';
import { CMPaymentRefundRoutingModule } from './c-m-payment-refund-routing.module';

@NgModule({
  declarations: [
    CMPaymentRefundMainComponent,
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
    CMPaymentRefundRoutingModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgScrollbarModule,
  ],
})
export class CMPaymentRefundModule {}
