import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { AppraisalRegistrationRoutingModule } from './appraisal-registration-routing.module';
import { AppraisalRegistrationComponent } from './appraisal-registration/appraisal-registration.component';
import { AppraisalDetailListComponent } from './components/appraisal-detail-list/appraisal-detail-list.component';
import { AppraisalEventFormComponent } from './components/appraisal-event-form/appraisal-event-form.component';
import { AppraisalGoodsTableComponent } from './components/appraisal-goods-table/appraisal-goods-table.component';
import { AppraisalListComponent } from './components/appraisal-list/appraisal-list.component';

@NgModule({
  declarations: [
    AppraisalRegistrationComponent,
    AppraisalEventFormComponent,
    AppraisalGoodsTableComponent,
    AppraisalListComponent,
    AppraisalDetailListComponent,
  ],
  imports: [CommonModule, AppraisalRegistrationRoutingModule, SharedModule],
})
export class AppraisalRegistrationModule {}
