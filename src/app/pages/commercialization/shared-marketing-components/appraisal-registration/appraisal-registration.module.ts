import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppraisalRegistrationRoutingModule } from './appraisal-registration-routing.module';
import { AppraisalRegistrationComponent } from './appraisal-registration/appraisal-registration.component';
import { AppraisalDetailActionsComponent } from './components/appraisal-detail-actions/appraisal-detail-actions.component';
import { AppraisalDetailListComponent } from './components/appraisal-detail-list/appraisal-detail-list.component';
import { AppraisalEventFormComponent } from './components/appraisal-event-form/appraisal-event-form.component';
import { AppraisalGoodsTableComponent } from './components/appraisal-goods-table/appraisal-goods-table.component';
import { AppraisalListComponent } from './components/appraisal-list/appraisal-list.component';
import { AppraisedRaejectedsContainerComponent } from './components/appraised-raejecteds-container/appraised-raejecteds-container.component';
import { AppraisedRejectedsGoodsListComponent } from './components/appraised-rejecteds-goods-list/appraised-rejecteds-goods-list.component';
import { AppraisedRejectedsListComponent } from './components/appraised-rejecteds-list/appraised-rejecteds-list.component';

@NgModule({
  declarations: [
    AppraisalRegistrationComponent,
    AppraisalEventFormComponent,
    AppraisalGoodsTableComponent,
    AppraisalListComponent,
    AppraisalDetailListComponent,
    AppraisalDetailActionsComponent,
    AppraisedRaejectedsContainerComponent,
    AppraisedRejectedsListComponent,
    AppraisedRejectedsGoodsListComponent,
  ],
  imports: [
    CommonModule,
    AppraisalRegistrationRoutingModule,
    SharedModule,
    TooltipModule,
    TabsModule,
  ],
})
export class AppraisalRegistrationModule {}
