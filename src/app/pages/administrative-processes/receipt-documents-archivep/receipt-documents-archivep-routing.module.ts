import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiptDocumentsArchiveComponent } from './receipt-documents-archive/receipt-documents-archive.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiptDocumentsArchiveComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptDocumentsArchivepRoutingModule {}
