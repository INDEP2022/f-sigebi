import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpPbdCPartializationGoodsDonationComponent } from './partialization-goods-donation/fdp-pbd-c-partialization-goods-donation.component';

const routes: Routes = [
  {
    path: '',
    component: FdpPbdCPartializationGoodsDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpPbdMPartializationGoodsDonationRoutingModule {}
