import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaCsCChangeOfStatusStiComponent } from './pa-cs-c-change-of-status-sti/pa-cs-c-change-of-status-sti.component';

const routes: Routes = [
  {
    path: '',
    component: PaCsCChangeOfStatusStiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMChangeOfStatusStiRoutingModule {}
