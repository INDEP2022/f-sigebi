import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiltersOfGoodsForDonationComponent } from './filters-of-goods-for-donation/filters-of-goods-for-donation.component';

const routes: Routes = [
  {
    path: '',
    component: FiltersOfGoodsForDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FiltersOfGoodsForDonationRoutingModule {}
