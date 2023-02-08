import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegulationsListComponent } from './regulations-list/regulations-list.component';

const routes: Routes = [
  {
    path: '',
    component: RegulationsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegulationsRoutingModule {}
