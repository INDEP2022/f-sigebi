import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClosingRecordsComponent } from './closing-records/closing-records.component';

const routes: Routes = [
  {
    path: '',
    component: ClosingRecordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosingConfiscationAndReturnRecordsRoutingModule {}
