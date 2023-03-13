import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartializationGoodsDonationComponent } from './partialization-goods-donation/partialization-goods-donation.component';

const routes: Routes = [
  {
    path: '',
    component: PartializationGoodsDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartializationGoodsDonationRoutingModule {}
