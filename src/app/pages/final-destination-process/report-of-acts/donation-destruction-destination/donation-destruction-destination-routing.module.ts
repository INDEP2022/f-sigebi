import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DonationDestructionDestinationComponent } from './donation-destruction-destination/donation-destruction-destination.component';

const routes: Routes = [
  {
    path: '',
    component: DonationDestructionDestinationComponent,
    data: { Title: 'Donación Destrucción Destino' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonationDestructionDestinationRoutingModule {}
