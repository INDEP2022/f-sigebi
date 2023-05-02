import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SaleCancellationRoutingModule } from './sale-cancellation-routing.module';
import { SaleCancellationComponent } from './sale-cancellation.component';

@NgModule({
  declarations: [SaleCancellationComponent],
  imports: [
    CommonModule,
    SaleCancellationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class SaleCancellationModule {}
