import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryInterconnectionFormComponent } from './query-interconnection-form/query-interconnection-form.component';

const routes: Routes = [
  {
    path: '',
    component: QueryInterconnectionFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryInterconnectionFormRoutingModule {}
