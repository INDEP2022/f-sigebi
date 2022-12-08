import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { GreCAnalysisResultMainComponent } from './gre-c-analysis-result-main/gre-c-analysis-result-main.component';
import { GreMAnalysisResultRoutingModule } from './gre-m-analysis-result-routing.module';

@NgModule({
  declarations: [GreCAnalysisResultMainComponent],
  imports: [
    CommonModule,
    GreMAnalysisResultRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
})
export class GreMAnalysisResultModule {}
