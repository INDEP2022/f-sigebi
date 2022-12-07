import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportGoodsDonationComponent } from './export-goods-donation/export-goods-donation.component';

const routes: Routes = [
  {
    path: '',
    component: ExportGoodsDonationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExportGoodsDonationRoutingModule {}
