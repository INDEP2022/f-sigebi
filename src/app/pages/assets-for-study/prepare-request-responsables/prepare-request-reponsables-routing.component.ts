import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrepareRequestsComponent } from './prepare-requests/prepare-requests.component';

const routes: Routes = [
  {
    path: '',
    component: PrepareRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrepareRequestReponsablesRoutingComponent {}
