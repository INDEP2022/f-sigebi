import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActsComponent } from './acts/acts.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { DerivationGoodsComponent } from './derivation-goods/derivation-goods.component';

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
    component: ActsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DerivationGoodsRoutingModule {}
