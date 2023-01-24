import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalysisResultMainComponent } from './analysis-result-main/analysis-result-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: AnalysisResultMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysisResultRoutingModule {}
