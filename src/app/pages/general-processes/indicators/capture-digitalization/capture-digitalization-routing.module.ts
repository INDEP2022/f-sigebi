import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaptureDigitalizationComponent } from './capture-digitalization/capture-digitalization.component';

const routes: Routes = [
  {
    path: '',
    component: CaptureDigitalizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptureDigitalizationRoutingModule {}
