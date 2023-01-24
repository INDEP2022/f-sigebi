import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LigiesDeparturesListComponent } from './ligies-departures-list/ligies-departures-list.component';

const routes: Routes = [
  {
    path: '',
    component: LigiesDeparturesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LigiesDeparturesRoutingModule {}
