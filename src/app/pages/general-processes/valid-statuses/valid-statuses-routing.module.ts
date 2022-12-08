import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidStatusesComponent } from './valid-statuses/valid-statuses.component';
const routes: Routes = [
  {
    path: '',
    component: ValidStatusesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidStatusesRoutingModule {}
