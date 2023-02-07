import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { GenerateDocumentNotAcceptedGoodsComponent } from './generate-document-not-accepted-goods/generate-document-not-accepted-goods.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateDocumentNotAcceptedGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class GenerateDocumentNotAcceptedGoodsRoutingModule {}
