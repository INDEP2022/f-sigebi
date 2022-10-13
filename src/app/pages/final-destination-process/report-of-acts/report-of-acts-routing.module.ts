import { FdpRdadddMDonationDestructionDestinationModule } from './donation-destruction-destination/fdp-rdaddd-m-donation-destruction-destination.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'donation-destruction-destination',
    loadChildren: () => 
      import('./donation-destruction-destination/fdp-rdaddd-m-donation-destruction-destination.module')
        .then( m => m.FdpRdadddMDonationDestructionDestinationModule)
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportOfActsRoutingModule { }
