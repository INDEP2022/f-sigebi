import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodDeliveryMainComponent } from './good-delivery-main/good-delivery-main.component';

const routes: Routes = [
  {
    path: '',
    component: GoodDeliveryMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodDeliveryRoutingModule {}
