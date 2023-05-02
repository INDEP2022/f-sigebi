import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FractionsListComponent } from './fractions-list/fractions-list.component';

const routes: Routes = [
  {
    path: '',
    component: FractionsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FractionsRoutingModule {}
