import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanDocumentComponent } from './loan-document/loan-document.component';

const routes: Routes = [
  {
    path: '',
    component: LoanDocumentComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class LoanDocumentRoutingModule {}
