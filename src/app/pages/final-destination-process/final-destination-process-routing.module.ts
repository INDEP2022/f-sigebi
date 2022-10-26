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
  {
    path: 'circumstantial-acts-suspension-cancellation',
    loadChildren: () =>
      import(
        './circumstantial-acts-suspension-cancellation/fdp-acsc-m-circumstantial-acts-suspension-cancellation.module'
      ).then(m => m.FdpAcscMCircumstantialActsSuspensionCancellationModule),
  },
  {
    path: 'acts-circumstantiated-cancellation-theft',
    loadChildren: () =>
      import(
        './acts-circumstantiated-cancellation-theft/fdp-accr-m-acts-circumstantiated-cancellation-theft.module'
      ).then(m => m.FdpAccrMActsCircumstantiatedCancellationTheftModule),
  },
  {
    path: 'proof-of-delivery',
    loadChildren: () =>
      import('./proof-of-delivery/fdp-cde-m-proof-of-delivery.module').then(
        m => m.FdpCdeMProofOfDeliveryModule
      ),
  },
  {
    path: 'acts-goods-delivered',
    loadChildren: () =>
      import(
        './acts-goods-delivered/fdp-abee-m-acts-goods-delivered.module'
      ).then(m => m.FdpAbeeMActsGoodsDeliveredModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalDestinationProcessRoutingModule {}
