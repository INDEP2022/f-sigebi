import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpCrdCCheckDestructionRequirementsComponent } from './check-destruction-requirements/fdp-crd-c-check-destruction-requirements.component';

const routes: Routes = [
  {
    path: '',
    component: FdpCrdCCheckDestructionRequirementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpCrdMCheckDestructionRequirementsRoutingModule {}
