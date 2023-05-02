import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DateDocumentsComponent } from './date-documents/date-documents.component';

const routes: Routes = [
  {
    path: '',
    component: DateDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DateDocumentsRoutingModule {}
