import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZoneGeographicListComponent } from './zone-geographic-list/zone-geographic-list.component';

const routes: Routes = [
  {
    path: '',
    component: ZoneGeographicListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZoneGeographicRoutingModule {}
