import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcumulativeAssetTabsComponent } from './acumulative-asset-tabs/acumulative-asset-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: AcumulativeAssetTabsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcumulativeAssetTabsRoutingModule {}
