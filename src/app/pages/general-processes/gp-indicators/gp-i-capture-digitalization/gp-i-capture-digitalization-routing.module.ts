import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpICaptureDigitalizationComponent } from './gp-i-capture-digitalization/gp-i-capture-digitalization.component';

const routes: Routes = [
  {
    path: '',
    component: GpICaptureDigitalizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpICaptureDigitalizationRoutingModule {}
