import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatorDeadlinesListComponent } from './indicator-deadlines-list/indicator-deadlines-list.component';
import { IndicatorDeadlinesRoutingModule } from './indicator-deadlines-routing.module';
import { IndicatorFormComponent } from './indicator-form/indicator-form.component';

@NgModule({
  declarations: [IndicatorDeadlinesListComponent, IndicatorFormComponent],
  imports: [
    CommonModule,
    IndicatorDeadlinesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class IndicatorDeadlinesModule {}
