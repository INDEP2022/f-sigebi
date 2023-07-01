import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBanksComponent } from './list-banks/list-banks.component';

const routes: Routes = [
  {
    path: '',
    component: ListBanksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanksCatalogRoutingModule {}
