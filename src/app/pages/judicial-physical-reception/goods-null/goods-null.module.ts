import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsNullRoutingModule } from './goods-null-routing.module';
import { GoodsNullComponent } from './goods-null.component';

@NgModule({
  imports: [CommonModule, GoodsNullRoutingModule, SharedModule],
  declarations: [GoodsNullComponent],
})
export class GoodsNullModule {}
