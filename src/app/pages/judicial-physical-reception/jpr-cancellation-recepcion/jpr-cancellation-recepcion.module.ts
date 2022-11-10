import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprCancellationRecepcionRoutingModule } from './jpr-cancellation-recepcion-routing.module';
import { JprCancellationRecepcionComponent } from './jpr-cancellation-recepcion.component';

@NgModule({
  declarations: [JprCancellationRecepcionComponent],
  imports: [
    CommonModule,
    JprCancellationRecepcionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprCancellationRecepcionModule {}
