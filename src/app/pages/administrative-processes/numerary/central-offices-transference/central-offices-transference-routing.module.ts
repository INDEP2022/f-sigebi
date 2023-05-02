import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentralOfficesTransferenceComponent } from './central-offices-transference/central-offices-transference.component';

const routes: Routes = [
  {
    path: '',
    component: CentralOfficesTransferenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentralOfficesTransferenceRoutingModule {}
