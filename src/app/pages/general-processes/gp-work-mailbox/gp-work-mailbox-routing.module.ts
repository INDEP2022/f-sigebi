import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpWorkMailboxComponent } from './gp-work-mailbox/gp-work-mailbox.component';
const routes: Routes = [
  {
    path: '',
    component: GpWorkMailboxComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpWorkMailboxRoutingModule {}
