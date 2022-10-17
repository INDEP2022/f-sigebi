import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpRdadddCDonationDestructionDestinationComponent } from './donation-destruction-destination/fdp-rdaddd-c-donation-destruction-destination.component';

const routes: Routes = [
  {
    path: '',
    component: FdpRdadddCDonationDestructionDestinationComponent,
    data: { Title: 'Donación Destrucción Destino' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpRdadddMDonationDestructionDestinationRoutingModule {}
