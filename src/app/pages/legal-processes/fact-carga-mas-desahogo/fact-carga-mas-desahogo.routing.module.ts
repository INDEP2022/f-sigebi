import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactCargaMasDesahogoComponent } from './fact-carga-mas-desahogo/fact-carga-mas-desahogo.component';

const routes: Routes = [
  {
    path: '',
    component: FactCargaMasDesahogoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactCargaMasDesahogoRoutingModule {}
