import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCEplCEventProcessListComponent } from './event-process-list/c-c-epl-c-event-process-list.component';

const routes: Routes = [
  {
    path: '',
    component: CCEplCEventProcessListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CCEpMEventProcessRoutingModule { }
