import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CancellationRecepcionRoutingModule } from './cancellation-recepcion-routing.module';
import { CancellationRecepcionComponent } from './cancellation-recepcion.component';

@NgModule({
  declarations: [CancellationRecepcionComponent],
  imports: [
    CommonModule,
    CancellationRecepcionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class CancellationRecepcionModule {}
