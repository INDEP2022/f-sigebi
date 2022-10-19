import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraireConversionTabsComponent } from './numeraire-conversion-tabs/numeraire-conversion-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraireConversionTabsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraireConversionTabsRoutingModule {}
