import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WareahouseCatalogComponent } from './wareahouse-catalog/wareahouse-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: WareahouseCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WareahouseCatalogRoutingModule {}
