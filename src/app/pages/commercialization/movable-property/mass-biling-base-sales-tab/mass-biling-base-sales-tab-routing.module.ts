import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassBilingBaseSalesTabComponent } from './mass-biling-base-sales-tab/mass-biling-base-sales-tab.component';

const routes: Routes = [
  {
    path: '',
    component: MassBilingBaseSalesTabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassBilingBaseSalesTabRoutingModule {}
