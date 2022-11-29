import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { RequestCompDocFormComponent } from './request-comp-doc-form/request-comp-doc-form.component';
import { RequestCompDocListComponent } from './request-comp-doc-list/request-comp-doc-list.component';
import { RequestCompDocTasksComponent } from './request-comp-doc-tasks/request-comp-doc-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: RequestCompDocListComponent,
  },
  {
    path: 'create',
    component: RequestCompDocFormComponent,
  },
  {
    path: 'tasks/:process/:request',
    component: RequestCompDocTasksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestComplementaryDocumentationRoutingModule {}
