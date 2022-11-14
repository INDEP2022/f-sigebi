import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPWcCWareahouseCatalogComponent } from './c-p-wc-c-wareahouse-catalog/c-p-wc-c-wareahouse-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPWcCWareahouseCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMWareahouseCatalogRoutingModule {}
