import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsgRsbCRegisterRequestGoodsComponent } from './register-request-goods/msg-rsb-c-register-request-goods.component';

const routes: Routes = [
  {
    path: '',
    component: MsgRsbCRegisterRequestGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MsgRsbMRegisterRequestGoodsRoutingModule {}
