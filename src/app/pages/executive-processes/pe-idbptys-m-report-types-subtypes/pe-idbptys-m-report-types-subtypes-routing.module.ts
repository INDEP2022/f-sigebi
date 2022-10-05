import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeIdbptysCReportTypesSubtypesComponent } from './pe-idbptys-c-report-types-subtypes/pe-idbptys-c-report-types-subtypes.component';

const routes: Routes = [
  {
    path: '',
    component: PeIdbptysCReportTypesSubtypesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeIdbptysMReportTypesSubtypesRoutingModule { }
