import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LigieMeasurementUnitsListComponent } from './ligie-measurement-units-list/ligie-measurement-units-list.component';

const routes: Routes = [
  {
    path: '',
    component: LigieMeasurementUnitsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LigieMeasurementUnitsRoutingModule {}
