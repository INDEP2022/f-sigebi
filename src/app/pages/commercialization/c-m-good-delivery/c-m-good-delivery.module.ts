import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCGoodDeliveryMainComponent } from './c-c-good-delivery-main/c-c-good-delivery-main.component';
import { CMGoodDeliveryRoutingModule } from './c-m-good-delivery-routing.module';

@NgModule({
  declarations: [CCGoodDeliveryMainComponent],
  imports: [
    CommonModule,
    CMGoodDeliveryRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class CMGoodDeliveryModule {}
