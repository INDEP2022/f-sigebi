import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckDestinationRequirementsComponent } from './check-destination-requirements/check-destination-requirements.component';

const routes: Routes = [
  {
    path: '',
    component: CheckDestinationRequirementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckDestinationRequirementsRoutingModule {}
