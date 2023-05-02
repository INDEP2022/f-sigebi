import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { ApproveRestitutionComponent } from './approve-restitution/approve-restitution.component';
import { AssetsApprovalRoutingModule } from './assets-approval-routing.module';
import { ListAssetsApprovedFormComponent } from './list-assets-approved-form/list-assets-approved-form.component';

@NgModule({
  declarations: [ApproveRestitutionComponent, ListAssetsApprovedFormComponent],
  imports: [
    CommonModule,
    AssetsApprovalRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    TabsModule,
    SharedComponentGssModule,
  ],
})
export class AssetsApprovalModule {}
