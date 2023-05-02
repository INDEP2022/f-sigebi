import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { ReturnsConficationsListComponent } from './returns-confications-list/returns-confications-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnsConficationsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnsConficationsRoutingModule {}
