import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCEtCEventTypesComponent } from './event-types/c-c-et-c-event-types.component';

const routes: Routes = [
  {
    path: '',
    component: CCEtCEventTypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CCEtMEventTypesRoutingModule { }
