import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCAnalysisResultMainComponent } from './gre-c-analysis-result-main/gre-c-analysis-result-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCAnalysisResultMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GreMAnalysisResultRoutingModule { }
