import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemittancesRecordedRegionComponent } from './remittances-recorded-region/remittances-recorded-region.component';

const routes: Routes = [
  {
    path: '',
    component: RemittancesRecordedRegionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemittancesRecordedRegionRoutingModule {}
