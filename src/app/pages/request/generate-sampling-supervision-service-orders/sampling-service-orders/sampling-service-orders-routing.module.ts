import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateQueryComponent } from './generate-query/generate-query.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateQueryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamplingServiceOrdersRoutingModule {}
