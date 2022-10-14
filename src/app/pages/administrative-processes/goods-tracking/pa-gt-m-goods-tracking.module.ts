import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
//Routing
import { PaGtMGoodsTrackingRoutingModule } from './pa-gt-m-goods-tracking-routing.module';
//Components
import { PaGrsCGoodsReviewStatusComponent } from './goods-review-status/pa-grs-c-goods-review-status.component';

@NgModule({
  declarations: [PaGrsCGoodsReviewStatusComponent],
  imports: [
    CommonModule,
    PaGtMGoodsTrackingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
  ],
})
export class PaGtMGoodsTrackingModule {}
