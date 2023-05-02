import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisionReasonListComponent } from './../revision-reason/revision-reason-list/revision-reason-list.component';

const routes: Routes = [
  {
    path: '',
    component: RevisionReasonListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevisionReasonRoutingModule {}
