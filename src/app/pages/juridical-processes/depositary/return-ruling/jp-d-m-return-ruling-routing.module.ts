import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDRrCReturnRulingComponent } from './jp-d-rr-c-return-ruling/jp-d-rr-c-return-ruling.component';

const routes: Routes = [
  {
    path: '',
    component: JpDRrCReturnRulingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMReturnRulingRoutingModule {}
