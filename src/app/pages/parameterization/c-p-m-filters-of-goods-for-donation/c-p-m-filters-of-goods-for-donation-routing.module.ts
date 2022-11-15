import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPFdCFiltersOfGoodsForDonationComponent } from './c-p-fd-c-filters-of-goods-for-donation/c-p-fd-c-filters-of-goods-for-donation.component';

const routes: Routes = [
  {
    path: '',
    component: CPFdCFiltersOfGoodsForDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMFiltersOfGoodsForDonationRoutingModule {}
