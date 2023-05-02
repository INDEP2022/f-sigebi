import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { DestinationGoodsActsComponent } from './destination-acts/destination-goods-acts.component';
import { DestinationGoodsActsRoutingModule } from './destination-goods-acts-routing.module';

@NgModule({
  declarations: [DestinationGoodsActsComponent],
  imports: [
    CommonModule,
    DestinationGoodsActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class DestinationGoodsActsModule {}
