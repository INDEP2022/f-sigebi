import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprSaleCancellationRoutingModule } from './jpr-sale-cancellation-routing.module';
import { JprSaleCancellationComponent } from './jpr-sale-cancellation.component';

@NgModule({
  declarations: [JprSaleCancellationComponent],
  imports: [
    CommonModule,
    JprSaleCancellationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprSaleCancellationModule {}
