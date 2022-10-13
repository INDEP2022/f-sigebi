import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorUnavoidableAssetsRoutingModule } from './monitor-unavoidable-assets-routing.module';
import { MonitorUnavoidableAssetsComponent } from './monitor-unavoidable-assets/monitor-unavoidable-assets.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MonitorUnavoidableAssetsParametersComponent } from './monitor-unavoidable-assets-parameters/monitor-unavoidable-assets-parameters.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    MonitorUnavoidableAssetsComponent,
    MonitorUnavoidableAssetsParametersComponent
  ],
  imports: [
    CommonModule,
    MonitorUnavoidableAssetsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    Ng2SmartTableModule,

  ]
})
export class MonitorUnavoidableAssetsModule { }
