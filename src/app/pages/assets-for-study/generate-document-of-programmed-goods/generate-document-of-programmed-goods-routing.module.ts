import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { GenerateDocumentOfProgrammedGoodsComponent } from './generate-document-of-programmed-goods/generate-document-of-programmed-goods.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateDocumentOfProgrammedGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class GenerateDocumentOfProgrammedGoodsRoutingModule {}
