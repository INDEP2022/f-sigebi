import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'donation-destruction-destination',
    loadChildren: () =>
      import(
        './donation-destruction-destination/donation-destruction-destination.module'
      ).then(m => m.DonationDestructionDestinationModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportOfActsRoutingModule {}
