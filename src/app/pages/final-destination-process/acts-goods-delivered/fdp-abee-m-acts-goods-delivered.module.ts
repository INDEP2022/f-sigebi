import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAbeeCActsGoodsDeliveredComponent } from './acts-goods-delivered/fdp-abee-c-acts-goods-delivered.component';
import { FdpAbeeMActsGoodsDeliveredRoutingModule } from './fdp-abee-m-acts-goods-delivered-routing.module';

@NgModule({
  declarations: [FdpAbeeCActsGoodsDeliveredComponent],
  imports: [
    CommonModule,
    FdpAbeeMActsGoodsDeliveredRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpAbeeMActsGoodsDeliveredModule {}
