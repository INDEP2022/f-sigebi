import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { RequestCompDocFormComponent } from './request-comp-doc-form/request-comp-doc-form.component';
import { RequestCompDocTasksComponent } from './request-comp-doc-tasks/request-comp-doc-tasks.component';

const routes: Routes = [
  {
    path: 'create',
    component: RequestCompDocFormComponent,
  },
  {
    path: 'create/:id',
    component: RequestCompDocFormComponent,
  },
  {
    path: 'tasks/:process/:request',
    component: RequestCompDocTasksComponent,
  },
  /*  {
    path: 'tasks/:request',
    component: RequestCompDocTasksComponent,
  }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestComplementaryDocumentationRoutingModule {}
