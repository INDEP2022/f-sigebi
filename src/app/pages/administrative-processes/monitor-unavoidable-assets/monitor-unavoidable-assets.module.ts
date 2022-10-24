import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonitorUnavoidableAssetsParametersComponent } from './monitor-unavoidable-assets-parameters/monitor-unavoidable-assets-parameters.component';
import { MonitorUnavoidableAssetsRoutingModule } from './monitor-unavoidable-assets-routing.module';
import { MonitorUnavoidableAssetsComponent } from './monitor-unavoidable-assets/monitor-unavoidable-assets.component';

@NgModule({
  declarations: [
    MonitorUnavoidableAssetsComponent,
    MonitorUnavoidableAssetsParametersComponent,
  ],
  imports: [
    CommonModule,
    MonitorUnavoidableAssetsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    Ng2SmartTableModule,
  ],
})
export class MonitorUnavoidableAssetsModule {}
