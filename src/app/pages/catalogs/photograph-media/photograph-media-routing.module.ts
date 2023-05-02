import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotographMediaListComponent } from './photograph-media-list/photograph-media-list.component';

const routes: Routes = [
  {
    path: '',
    component: PhotographMediaListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotographMediaRoutingModule {}
