import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuidelinesListComponent } from './guidelines-list/guidelines-list.component';

const routes: Routes = [
  {
    path: '',
    component: GuidelinesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidelinesRoutingModule {}
