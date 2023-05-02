import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProceedingsConversionComponent } from './proceedings-conversion/proceedings-conversion.component';

const routes: Routes = [
  {
    path: '',
    component: ProceedingsConversionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProceedingsConversionRoutingModule {}
