import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterRequestGoodsComponent } from './register-request-goods/register-request-goods.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterRequestGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRequestGoodsRoutingModule {}
