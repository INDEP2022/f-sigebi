import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "destruction-acts",
    loadChildren: () =>
      import("./destruction-acts/fdp-add-m-destruction-acts.module").then(
        (m) => m.FdpAddMDestructionActsModule
      ),
  },
  {
    path: "donation-acts",
    loadChildren: () =>
      import("./donation-acts/fdp-add-m-donation-acts.module").then(
        (m) => m.FdpAddMDonationActsModule
      ),
  },
  {
    path: "destination-acts",
    loadChildren: () =>
      import("./destination-acts/fdp-add-m-destination-goods-acts.module").then(
        (m) => m.FdpAddMDestinationGoodsActsModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinalDestinationProcessRoutingModule { }
