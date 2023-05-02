import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraireExchangeFormComponent } from './numeraire-exchange-form/numeraire-exchange-form.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraireExchangeFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraireExchangeRoutingModule {}
