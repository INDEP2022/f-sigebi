import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCPlCParametersListComponent } from './parameter-list/c-c-pl-c-parameters-list.component';

const routes: Routes = [
  {
    path: '',
    component: CCPlCParametersListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CCPMParametersRoutingModule { }
