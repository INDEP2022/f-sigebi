import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDTCTrialsComponent } from './jp-d-t-c-trials/jp-d-t-c-trials.component';

const routes: Routes = [
  {
    path: '',
    component: JpDTCTrialsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMTrialsRoutingModule {}
