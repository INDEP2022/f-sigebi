import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCValidCaptureLineComponent } from './sw-comer-c-valid-capture-line/sw-comer-c-valid-capture-line.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCValidCaptureLineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMValidCaptureLineRoutingModule {}
