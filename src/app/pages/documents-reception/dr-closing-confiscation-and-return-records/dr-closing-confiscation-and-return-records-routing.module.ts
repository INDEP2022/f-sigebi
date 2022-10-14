import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrClosingRecordsComponent } from './dr-closing-records/dr-closing-records.component';

const routes: Routes = [
  {
    path: '',
    component: DrClosingRecordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrClosingConfiscationAndReturnRecordsRoutingModule {}
