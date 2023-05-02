import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsVigilanceServiceRoutingModule } from './goods-vigilance-service-routing.module';
import { GoodsVigilanceServiceComponent } from './goods-vigilance-service/goods-vigilance-service.component';

@NgModule({
  declarations: [GoodsVigilanceServiceComponent],
  imports: [CommonModule, GoodsVigilanceServiceRoutingModule, SharedModule],
})
export class GoodsVigilanceServiceModule {}
