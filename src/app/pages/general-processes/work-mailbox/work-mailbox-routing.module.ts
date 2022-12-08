import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkMailboxComponent } from './work-mailbox/work-mailbox.component';
const routes: Routes = [
  {
    path: '',
    component: WorkMailboxComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkMailboxRoutingModule {}
