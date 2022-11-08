import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCGoodDeliveryMainComponent } from './c-c-good-delivery-main/c-c-good-delivery-main.component';

const routes: Routes = [
  {
    path: '',
    component: CCGoodDeliveryMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CMGoodDeliveryRoutingModule { }
