import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpFtCTechnicalSheetsComponent } from './technical-sheets/fdp-ft-c-technical-sheets.component';

const routes: Routes = [
  {
    path: '',
    component: FdpFtCTechnicalSheetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpFtMTechnicalSheetsRoutingModule {}
