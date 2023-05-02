import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeOfStatusStiComponent } from './change-of-status-sti/change-of-status-sti.component';

const routes: Routes = [
  {
    path: '',
    component: ChangeOfStatusStiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeOfStatusStiRoutingModule {}
