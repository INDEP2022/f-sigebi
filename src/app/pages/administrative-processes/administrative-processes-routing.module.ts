import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'numerary-operator',
    loadChildren: async () =>
      (await import('./numerary-operator/numerary-operator.module')).NumeraryOperatorModule,
    data: { title: 'Numerario Operado' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativeProcessesRoutingModule { }
