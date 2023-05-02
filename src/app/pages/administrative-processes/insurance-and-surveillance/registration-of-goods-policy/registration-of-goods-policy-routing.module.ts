import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationOfGoodsPolicyComponent } from './registration-of-goods-policy/registration-of-goods-policy.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationOfGoodsPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationOfGoodsPolicyRoutingModule {}
