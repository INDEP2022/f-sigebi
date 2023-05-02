import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusChangeComponent } from './status-change/status-change.component';

const routes: Routes = [
  {
    path: '',
    component: StatusChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusChangeRoutingModule {}
