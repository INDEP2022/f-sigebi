import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCManagementCaptureLinesComponent } from './sw-comer-c-management-capture-lines/sw-comer-c-management-capture-lines.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCManagementCaptureLinesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMManagementCaptureLinesRoutingModule {}
