import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanksCatalogComponent } from './banks-catalog/banks-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: BanksCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanksCatalogRoutingModule {}
