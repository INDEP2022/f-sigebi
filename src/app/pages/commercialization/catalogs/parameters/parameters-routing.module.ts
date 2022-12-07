import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { ParametersListComponent } from './parameters-list/parameters-list.component';

const routes: Routes = [
  {
    path: '',
    component: ParametersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametersRoutingModule {}
