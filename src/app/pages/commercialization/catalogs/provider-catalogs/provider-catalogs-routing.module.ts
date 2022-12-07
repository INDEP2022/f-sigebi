import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderCatalogsMainComponent } from './provider-catalogs-main/provider-catalogs-main.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderCatalogsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProviderCatalogsRoutingModule {}
