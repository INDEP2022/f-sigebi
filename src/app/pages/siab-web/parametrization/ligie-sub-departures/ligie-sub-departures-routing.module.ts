import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LigieSubDeparturesListComponent } from './ligie-sub-departures-list/ligie-sub-departures-list.component';

const routes: Routes = [
  {
    path: '',
    component: LigieSubDeparturesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LigieSubDeparturesRoutingModule {}
