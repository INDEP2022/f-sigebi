import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalRegistryComponent } from './appraisal-registry/appraisal-registry.component';

const routes: Routes = [
  {
    path: '',
    component: AppraisalRegistryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalRegistryRoutingModule {}
