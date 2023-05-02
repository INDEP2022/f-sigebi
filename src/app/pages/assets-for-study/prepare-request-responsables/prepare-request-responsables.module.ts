import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { SharedRequestModule } from '../../request/shared-request/shared-request.module';
import { AfsSharedComponentsModule } from '../afs-shared-components/afs-shared-components.module';
import { PrepareRequestReponsablesRoutingComponent } from './prepare-request-reponsables-routing.component';
import { PrepareRequestsComponent } from './prepare-requests/prepare-requests.component';
import { RecipientDataComponent } from './recipient-data/recipient-data.component';
import { ReportPreviewComponent } from './report-preview/report-preview.component';

@NgModule({
  declarations: [
    PrepareRequestsComponent,
    RecipientDataComponent,
    ReportPreviewComponent,
  ],
  imports: [
    CommonModule,
    PrepareRequestReponsablesRoutingComponent,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    AfsSharedComponentsModule,
    SharedRequestModule,
    TabsModule,
  ],
})
export class PrepareRequestResponsablesModule {}
