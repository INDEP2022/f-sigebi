import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuredNumeraryAccountComponent } from './insured-numerary-account/insured-numerary-account.component';

const routes: Routes = [
  {
    path: '',
    component: InsuredNumeraryAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsuredNumeraryAccountRoutingModule {}
