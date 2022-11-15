import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPWcCBanksCatalogComponent } from './c-p-wc-c-banks-catalog/c-p-wc-c-banks-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPWcCBanksCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMBanksCatalogRoutingModule {}
