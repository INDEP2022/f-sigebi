import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsValidationComponent } from './records-validation/records-validation.component';

const routes: Routes = [
  {
    path: '',
    component: RecordsValidationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsValidationRoutingModule {}
