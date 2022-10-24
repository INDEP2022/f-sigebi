import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprCancellationRecepcionRoutingModule } from './jpr-cancellation-recepcion-routing.module';
import { JprCancellationRecepcionComponent } from './jpr-cancellation-recepcion.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprCancellationRecepcionComponent
  ],
  imports: [
    CommonModule,
    JprCancellationRecepcionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprCancellationRecepcionModule { }
