import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprSaleCancellationRoutingModule } from './jpr-sale-cancellation-routing.module';
import { JprSaleCancellationComponent } from './jpr-sale-cancellation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprSaleCancellationComponent
  ],
  imports: [
    CommonModule,
    JprSaleCancellationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprSaleCancellationModule { }
