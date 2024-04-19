import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormLoadAppraisalsModalComponent } from './form-load-appraisals-modal/form-load-appraisals-modal/form-load-appraisals-modal.component';
import { FormLoadAppraisalsRoutingModule } from './form-load-appraisals-routing.module';
import { FormLoadAppraisalsComponent } from './form-load-appraisals/form-load-appraisals.component';

@NgModule({
  declarations: [FormLoadAppraisalsComponent, FormLoadAppraisalsModalComponent],
  imports: [
    CommonModule,
    FormLoadAppraisalsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class FormLoadAppraisalsModule {}
