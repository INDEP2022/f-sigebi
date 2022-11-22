import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestCompDocFormComponent } from './request-comp-doc-form/request-comp-doc-form.component';
import { RequestCompDocListComponent } from './request-comp-doc-list/request-comp-doc-list.component';

const routes: Routes = [
  {
    path: '',
    component: RequestCompDocListComponent,
  },
  {
    path: 'create',
    component: RequestCompDocFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestComplementaryDocumentationRoutingModule {}
