import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { RegisterRequestGoodsRoutingModule } from './register-request-goods-routing.module';
import { RegisterRequestGoodsComponent } from './register-request-goods/register-request-goods.component';
@NgModule({
  declarations: [RegisterRequestGoodsComponent],
  imports: [
    CommonModule,
    RegisterRequestGoodsRoutingModule,
    SharedModule,
    TabsModule,
    SharedRequestModule,
  ],
  exports: [RegisterRequestGoodsComponent],
})
export class RegisterRequestGoodsModule {}
