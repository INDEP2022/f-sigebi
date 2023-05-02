import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
//Routing
import { GoodsTrackingRoutingModule } from './goods-tracking-routing.module';
//Components
import { GoodsReviewStatusComponent } from './goods-review-status/goods-review-status.component';

@NgModule({
  declarations: [GoodsReviewStatusComponent],
  imports: [
    CommonModule,
    GoodsTrackingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
  ],
})
export class GoodsTrackingModule {}
