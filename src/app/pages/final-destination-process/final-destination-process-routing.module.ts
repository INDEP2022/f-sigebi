import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'destruction-acts',
    loadChildren: () =>
      import('./destruction-acts/destruction-acts.module').then(
        m => m.DestructionActsModule
      ),
  },
  {
    path: 'donation-acts',
    loadChildren: () =>
      import('./donation-acts/donation-acts.module').then(
        m => m.DonationActsModule
      ),
  },
  {
    path: 'destination-acts',
    loadChildren: () =>
      import('./destination-acts/destination-goods-acts.module').then(
        m => m.DestinationGoodsActsModule
      ),
  },
  {
    path: 'return-acts',
    loadChildren: () =>
      import('./return-acts/return-acts.module').then(
        m => m.FdpAddMReturnActsModule
      ),
  },
  {
    path: 'third-possession-acts',
    loadChildren: () =>
      import('./third-party-possession-acts/third-possession-acts.module').then(
        m => m.ThirdPossessionActsModule
      ),
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
        './circumstantial-acts-suspension-cancellation/circumstantial-acts-suspension-cancellation.module'
      ).then(m => m.CircumstantialActsSuspensionCancellationModule),
  },
  {
    path: 'acts-circumstantiated-cancellation-theft',
    loadChildren: () =>
      import(
        './acts-circumstantiated-cancellation-theft/acts-circumstantiated-cancellation-theft.module'
      ).then(m => m.ActsCircumstantiatedCancellationTheftModule),
  },
  {
    path: 'proof-of-delivery',
    loadChildren: () =>
      import('./proof-of-delivery/proof-of-delivery.module').then(
        m => m.ProofOfDeliveryModule
      ),
  },
  {
    path: 'acts-goods-delivered',
    loadChildren: () =>
      import('./acts-goods-delivered/acts-goods-delivered.module').then(
        m => m.ActsGoodsDeliveredModule
      ),
  },
  {
    path: 'acts-regularization-non-existence',
    loadChildren: () =>
      import(
        './acts-regularization-non-existence/acts-regularization-non-existence.module'
      ).then(m => m.ActsRegularizationNonExistenceModule),
  },
  {
    path: 'return-acts-report',
    loadChildren: () =>
      import('./return-acts-report/return-acts-report.module').then(
        m => m.ReturnActsReportModule
      ),
  },
  {
    path: 'check-donation-requirements',
    loadChildren: () =>
      import(
        './check-donation-requirements/check-donation-requirements.module'
      ).then(m => m.CheckDonationRequirementsModule),
  },
  {
    path: 'check-destruction-requirements',
    loadChildren: () =>
      import(
        './check-destruction-requirements/check-destruction-requirements.module'
      ).then(m => m.CheckDestructionRequirementsModule),
  },
  {
    path: 'check-destination-requirements',
    loadChildren: () =>
      import(
        './check-destination-requirements/check-destination-requirements.module'
      ).then(m => m.CheckDestinationRequirementsModule),
  },
  {
    path: 'review-technical-sheets',
    loadChildren: () =>
      import('./review-technical-sheets/review-technical-sheets.module').then(
        m => m.ReviewTechnicalSheetsModule
      ),
  },
  {
    path: 'technical-sheets',
    loadChildren: () =>
      import('./technical-sheets/technical-sheets.module').then(
        m => m.TechnicalSheetsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalDestinationProcessRoutingModule {}
