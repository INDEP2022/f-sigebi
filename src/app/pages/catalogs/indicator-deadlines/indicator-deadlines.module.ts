import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorDeadlinesFormComponent } from './indicator-deadlines-form/indicator-deadlines-form.component';
import { IndicatorDeadlinesListComponent } from './indicator-deadlines-list/indicator-deadlines-list.component';
import { IndicatorDeadlinesParametersComponent } from './indicator-deadlines-parameters/indicator-deadlines-parameters.component';
import { IndicatorDeadlinesRoutingModule } from './indicator-deadlines-routing.module';

@NgModule({
  declarations: [
    IndicatorDeadlinesListComponent,
    IndicatorDeadlinesFormComponent,
    IndicatorDeadlinesParametersComponent,
  ],
  imports: [
    CommonModule,
    IndicatorDeadlinesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class IndicatorDeadlinesModule {}
