import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EconomicResourcesMainComponent } from './economic-resources-main/economic-resources-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: EconomicResourcesMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EconomicResourcesRoutingModule {}
