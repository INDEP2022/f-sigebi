import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMMaximumTimesForAbandonmentRoutingModule } from './c-p-m-maximum-times-for-abandonment-routing.module';
import { CPMtaCMaximumTimesForAbandonmentComponent } from './c-p-mta-c-maximum-times-for-abandonment/c-p-mta-c-maximum-times-for-abandonment.component';
import { FielSetUncollectedComponent } from './fiel-set-uncollected/fiel-set-uncollected.component';
import { FielSetUnstatedComponent } from './fiel-set-unstated/fiel-set-unstated.component';

@NgModule({
  declarations: [
    CPMtaCMaximumTimesForAbandonmentComponent,
    FielSetUnstatedComponent,
    FielSetUncollectedComponent,
  ],
  imports: [
    CommonModule,
    CPMMaximumTimesForAbandonmentRoutingModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
  ],
})
export class CPMMaximumTimesForAbandonmentModule {}
