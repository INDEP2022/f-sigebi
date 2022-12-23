import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApproveRestitutionFormComponent } from './approve-restitution-form/approve-restitution-form.component';
import { ClassificationGoodsFormComponent } from './classification-goods-form/classification-goods-form.component';
import { ChargeDocumentsFormComponent } from './components/charge-documents-form/charge-documents-form.component';
import { EntryOrderFormComponent } from './components/entry-order-form/entry-order-form.component';
import { FormatReclamationFormComponent } from './components/format-reclamation-form/format-reclamation-form.component';
import { ReportShowComponent } from './components/report-show/report-show.component';
import { ExecuteReturnDeliveriesListComponent } from './execute-return-deliveries-list/execute-return-deliveries-list.component';
import { ExecuteReturnDeliveriesRoutingModule } from './execute-return-deliveries-routing.module';
import { RestitutionGoodsFormComponent } from './restitution-goods-form/restitution-goods-form.component';

@NgModule({
  declarations: [
    ExecuteReturnDeliveriesListComponent,
    ApproveRestitutionFormComponent,
    ClassificationGoodsFormComponent,
    RestitutionGoodsFormComponent,
    FormatReclamationFormComponent,
    ReportShowComponent,
    ChargeDocumentsFormComponent,
    EntryOrderFormComponent,
  ],
  imports: [
    CommonModule,
    ExecuteReturnDeliveriesRoutingModule,
    SharedModule,
    ModalModule.forRoot(),
    UsersSharedComponent,
  ],
})
export class ExecuteReturnDeliveriesModule {}
