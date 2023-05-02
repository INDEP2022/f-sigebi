import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZonesComponent } from './zones/zones.component';

const routes: Routes = [
  {
    path: '',
    component: ZonesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZonesRoutingModule {}
