import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { AnalysisResultMainComponent } from './analysis-result-main/analysis-result-main.component';
import { AnalysisResultRoutingModule } from './analysis-result-routing.module';

@NgModule({
  declarations: [AnalysisResultMainComponent],
  imports: [
    CommonModule,
    AnalysisResultRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
})
export class AnalysisResultModule {}
