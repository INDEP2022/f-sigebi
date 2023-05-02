import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeOfStatusComponent } from './change-of-status/change-of-status.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeOfStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeOfStatusRoutingModule {}
