import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDLooCLegalOpinionsOfficeComponent } from './jp-d-loo-c-legal-opinions-office/jp-d-loo-c-legal-opinions-office.component';

const routes: Routes = [
  {
    path: '',
    component: JpDLooCLegalOpinionsOfficeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMLegalOpinionsOfficeRoutingModule {}
