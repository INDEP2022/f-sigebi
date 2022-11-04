import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCCProviderCatalogsMainComponent } from './c-c-c-provider-catalogs-main/c-c-c-provider-catalogs-main.component';

const routes: Routes = [
  {
    path: '',
    component: CCCProviderCatalogsMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCMProviderCatalogsRoutingModule {}
