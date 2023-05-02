import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsSentToMasterfileComponent } from './documents-sent-to-masterfile/documents-sent-to-masterfile.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsSentToMasterfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsSentToMasterfileRoutingModule {}
