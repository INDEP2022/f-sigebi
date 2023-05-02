import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsGoodsDeliveredRoutingModule } from './acts-goods-delivered-routing.module';
import { ActsGoodsDeliveredComponent } from './acts-goods-delivered/acts-goods-delivered.component';

@NgModule({
  declarations: [ActsGoodsDeliveredComponent],
  imports: [
    CommonModule,
    ActsGoodsDeliveredRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class ActsGoodsDeliveredModule {}
