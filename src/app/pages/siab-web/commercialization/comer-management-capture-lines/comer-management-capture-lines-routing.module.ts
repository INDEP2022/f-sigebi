import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComerManagementCaptureLinesComponent } from './comer-management-capture-lines-form/comer-management-capture-lines-form.component';

const routes: Routes = [
  {
    path: '',
    component: ComerManagementCaptureLinesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComerManagementCaptureLinesRoutingModule {}
