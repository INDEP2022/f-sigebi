import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CaptureLinesMainComponent } from './capture-lines-main/capture-lines-main.component';

const routes: Routes = [
  {
    path: '',
    component: CaptureLinesMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptureLinesRoutingModule {}
