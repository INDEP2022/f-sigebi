import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrGoodsVigilanceServiceRoutingModule } from './dr-goods-vigilance-service-routing.module';
import { DrGoodsVigilanceServiceComponent } from './dr-goods-vigilance-service/dr-goods-vigilance-service.component';

@NgModule({
  declarations: [DrGoodsVigilanceServiceComponent],
  imports: [CommonModule, DrGoodsVigilanceServiceRoutingModule, SharedModule],
})
export class DrGoodsVigilanceServiceModule {}
