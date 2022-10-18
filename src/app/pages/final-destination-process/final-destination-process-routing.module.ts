import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'destruction-acts',
    loadChildren: () =>
      import('./destruction-acts/fdp-add-m-destruction-acts.module').then(
        m => m.FdpAddMDestructionActsModule
      ),
  },
  {
    path: 'donation-acts',
    loadChildren: () =>
      import('./donation-acts/fdp-add-m-donation-acts.module').then(
        m => m.FdpAddMDonationActsModule
      ),
  },
  {
    path: 'destination-acts',
    loadChildren: () =>
      import('./destination-acts/fdp-add-m-destination-goods-acts.module').then(
        m => m.FdpAddMDestinationGoodsActsModule
      ),
  },
  {
    path: 'return-acts',
    loadChildren: () =>
      import('./return-acts/fdp-add-m-return-acts.module').then(
        m => m.FdpAddMReturnActsModule
      ),
  },
  {
    path: 'third-possession-acts',
    loadChildren: () =>
      import(
        './third-party-possession-acts/fdp-adpdt-m-third-possession-acts.module'
      ).then(m => m.FdpAdpdtMThirdPossessionActsModule),
  },
  {
    path: 'report-of-acts',
    loadChildren: () =>
      import('./report-of-acts/report-of-acts.module').then(
        m => m.ReportOfActsModule
      ),
  },
  {
    path: 'delivery-schedule',
    loadChildren: () =>
      import('./delivery-schedule/delivery-schedule.module').then(
        m => m.DeliveryScheduleModule
      ),
  },
  {
    path: 'donation-process',
    loadChildren: () =>
      import('./donation-process/donation-process.module').then(
        m => m.DonationProcessModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalDestinationProcessRoutingModule {}
