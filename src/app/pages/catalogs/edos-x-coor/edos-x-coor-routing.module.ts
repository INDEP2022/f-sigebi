import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EdosXCoorListComponent } from './edos-x-coor-list/edos-x-coor-list.component';

const routes: Routes = [
  {
    path: '',
    component: EdosXCoorListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdosXCoorRoutingModule {}
