import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { validCaptureLineComponent } from './valid-capture-line/valid-capture-line.component';

const routes: Routes = [
  {
    path: '',
    component: validCaptureLineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class validCaptureLineRoutingModule {}
