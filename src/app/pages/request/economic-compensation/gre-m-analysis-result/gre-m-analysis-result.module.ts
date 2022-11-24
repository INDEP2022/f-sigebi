import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GreMAnalysisResultRoutingModule } from './gre-m-analysis-result-routing.module';
import { GreCAnalysisResultMainComponent } from './gre-c-analysis-result-main/gre-c-analysis-result-main.component';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';


@NgModule({
  declarations: [
    GreCAnalysisResultMainComponent
  ],
  imports: [
    CommonModule,
    GreMAnalysisResultRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ]
})
export class GreMAnalysisResultModule { }
