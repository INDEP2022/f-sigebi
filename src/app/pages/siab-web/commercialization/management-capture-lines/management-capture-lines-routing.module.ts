import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { managementCaptureLinesComponent } from './management-capture-lines/management-capture-lines.component';

const routes: Routes = [
  {
    path: '',
    component: managementCaptureLinesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class managementCaptureLinesRoutingModule {}
