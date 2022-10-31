import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpCrdCCheckDestinationRequirementsComponent } from './check-destination-requirements/fdp-crd-c-check-destination-requirements.component';

const routes: Routes = [
  {
    path: '',
    component: FdpCrdCCheckDestinationRequirementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpCrdMCheckDestinationRequirementsRoutingModule {}
