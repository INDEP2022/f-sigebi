import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalOpinionsOfficeComponent } from './legal-opinions-office/legal-opinions-office.component';

const routes: Routes = [
  {
    path: '',
    component: LegalOpinionsOfficeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalOpinionsOfficeRoutingModule {}
