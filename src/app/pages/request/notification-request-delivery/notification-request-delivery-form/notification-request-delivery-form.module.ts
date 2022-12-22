import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { NotificationRequestDeliveryformRoutingModule } from './notification-request-delivery-form-routing.module';
import { DataDictumFormComponent } from './notification-request-delivery-form/components/data-dictum-form/data-dictum-form.component';
import { DocumentsRequestFormComponent } from './notification-request-delivery-form/components/documents-request-form/documents-request-form.component';
import { GoodsRequestFormComponent } from './notification-request-delivery-form/components/goods-request-form/goods-request-form.component';
import { GoodsSelectedFormComponent } from './notification-request-delivery-form/components/goods-selected-form/goods-selected-form.component';
import { GuidelinesFormComponent } from './notification-request-delivery-form/components/guidelines-form/guidelines-form.component';
import { NotificationFormComponent } from './notification-request-delivery-form/components/notification-form/notification-form.component';
import { RecordDocumentationFormComponent } from './notification-request-delivery-form/components/record-documentation-form/record-documentation-form.component';
import { ViewDocumentsFormComponent } from './notification-request-delivery-form/components/view-documents-form/view-documents-form.component';
import { NotificationRequestDeliveryFormComponent } from './notification-request-delivery-form/notification-request-delivery-form.component';

@NgModule({
  declarations: [
    NotificationRequestDeliveryFormComponent,
    RecordDocumentationFormComponent,
    GoodsSelectedFormComponent,
    GuidelinesFormComponent,
    DataDictumFormComponent,
    DocumentsRequestFormComponent,
    GoodsRequestFormComponent,
    ViewDocumentsFormComponent,
    NotificationFormComponent,
  ],
  imports: [
    CommonModule,
    NotificationRequestDeliveryformRoutingModule,
    SharedModule,
    SharedRequestModule,
    TabsModule.forRoot(),
    ModalModule.forChild(),
  ],
})
export class NotificationRequestDeliveryFormModule {}
