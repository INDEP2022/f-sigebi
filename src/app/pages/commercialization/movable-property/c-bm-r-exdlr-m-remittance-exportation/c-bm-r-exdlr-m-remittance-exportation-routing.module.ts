import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmRExdlrCRemittanceExportationComponent } from './c-bm-r-exdlr-c-remittance-exportation/c-bm-r-exdlr-c-remittance-exportation.component';

const routes: Routes = [
  {
    path: '',
    component: CBmRExdlrCRemittanceExportationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBmRExdlrMRemittanceExportationRoutingModule { }
