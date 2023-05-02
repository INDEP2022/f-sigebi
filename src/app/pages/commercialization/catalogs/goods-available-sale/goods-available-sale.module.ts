import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { GoodsAvailableSaleRoutingModule } from './goods-available-sale-routing.module';
import { StatusComponent } from './status/status.component';

@NgModule({
  declarations: [StatusComponent],
  imports: [
    CommonModule,
    GoodsAvailableSaleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class GoodsAvailableSaleModule {}
