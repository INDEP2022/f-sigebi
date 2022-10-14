import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrRecordsValidationComponent } from './dr-records-validation/dr-records-validation.component';

const routes: Routes = [
  {
    path: '',
    component: DrRecordsValidationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrRecordsValidationRoutingModule {}
