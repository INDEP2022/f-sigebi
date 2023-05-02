import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckDestructionRequirementsComponent } from './check-destruction-requirements/check-destruction-requirements.component';

const routes: Routes = [
  {
    path: '',
    component: CheckDestructionRequirementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckDestructionRequirementsRoutingModule {}
