import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { DerivationGoodsComponent } from './derivation-goods/derivation-goods.component';
import { PaDgCActsComponent } from './pa-dg-c-acts/pa-dg-c-acts.component';

const routes: Routes = [
  {
    path: '',
    component: DerivationGoodsComponent,
  },
  {
    path: 'bulk-upload',
    component: BulkUploadComponent,
  },
  {
    path: 'act',
    component: PaDgCActsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DerivationGoodsRoutingModule {}
