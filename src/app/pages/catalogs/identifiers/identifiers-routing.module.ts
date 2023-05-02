import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdentifiersListComponent } from './identifiers-list/identifiers-list.component';

const routes: Routes = [
  {
    path: '',
    component: IdentifiersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentifiersRoutingModule {}
