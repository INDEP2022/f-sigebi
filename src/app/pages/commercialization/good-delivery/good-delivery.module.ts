import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodDeliveryMainComponent } from './good-delivery-main/good-delivery-main.component';
import { GoodDeliveryRoutingModule } from './good-delivery-routing.module';

@NgModule({
  declarations: [GoodDeliveryMainComponent],
  imports: [
    CommonModule,
    GoodDeliveryRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class GoodDeliveryModule {}
