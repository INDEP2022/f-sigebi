import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBmFSyfCSeriesFoliosControlComponent } from './c-bm-f-syf-c-series-folios-control/c-bm-f-syf-c-series-folios-control.component';

const routes: Routes = [
  {
    path: '',
    component: CBmFSyfCSeriesFoliosControlComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBmFSyfMSeriesFoliosControlRoutingModule { }
