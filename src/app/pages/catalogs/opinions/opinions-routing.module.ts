import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpinionsListComponent } from './opinions-list/opinions-list.component';

const routes: Routes = [
  {
    path: '',
    component: OpinionsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpinionsRoutingModule {}
