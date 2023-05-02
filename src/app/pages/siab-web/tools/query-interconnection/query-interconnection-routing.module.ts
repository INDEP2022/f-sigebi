import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: async () =>
      (
        await import(
          './query-interconnection-form/query-interconnection-form.module'
        )
      ).QueryInterconnectionFormModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryInterconnectionRoutingModule {}
