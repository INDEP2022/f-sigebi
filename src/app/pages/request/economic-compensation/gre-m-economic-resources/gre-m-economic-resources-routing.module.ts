import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCEconomicResourcesMainComponent } from './gre-c-economic-resources-main/gre-c-economic-resources-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCEconomicResourcesMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreMEconomicResourcesRoutingModule {}
