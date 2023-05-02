import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsViewFinderRoutingModule } from './goods-view-finder-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, GoodsViewFinderRoutingModule, SharedModule],
})
export class GoodsViewFinderModule {}
