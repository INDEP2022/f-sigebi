import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmRRrprCRemittancesRecordedRegionComponent } from './c-bm-r-rrpr-c-remittances-recorded-region/c-bm-r-rrpr-c-remittances-recorded-region.component';

const routes: Routes = [
  {
    path: '',
    component: CBmRRrprCRemittancesRecordedRegionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBmRRrprMRemittancesRecordedRegionRoutingModule {}
