import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClarificationsListComponent } from './clarifications-list/clarifications-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClarificationsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClarificationsRoutingModule {}
