import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { IfaiSeriesFormComponent } from './ifai-series-form/ifai-series-form.component';
import { IfaiSeriesListComponent } from './ifai-series-list/ifai-series-list.component';
import { IfaiSeriesRoutingModule } from './ifai-series-routing.module';

@NgModule({
  declarations: [IfaiSeriesListComponent, IfaiSeriesFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    IfaiSeriesRoutingModule,
  ],
})
export class IfaiSeriesModule {}
