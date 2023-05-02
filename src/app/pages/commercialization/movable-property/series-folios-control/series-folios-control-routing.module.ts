import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeriesFoliosControlComponent } from './series-folios-control/series-folios-control.component';

const routes: Routes = [
  {
    path: '',
    component: SeriesFoliosControlComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeriesFoliosControlRoutingModule {}
