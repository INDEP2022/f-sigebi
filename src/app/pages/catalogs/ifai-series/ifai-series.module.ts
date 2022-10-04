import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IfaiSeriesRoutingModule } from './ifai-series-routing.module';
import { IfaiSeriesListComponent } from './ifai-series-list/ifai-series-list.component';
import { IfaiSeriesFormComponent } from './ifai-series-form/ifai-series-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
