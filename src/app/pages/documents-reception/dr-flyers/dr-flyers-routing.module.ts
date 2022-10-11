import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RdFDocumentsReceptionRegisterComponent } from './rd-f-documents-reception-register/rd-f-documents-reception-register.component';
import { RdFRecordUpdateComponent } from './rd-f-record-update/rd-f-record-update.component';
import { RdFRelatedDocumentsComponent } from './rd-f-related-documents/rd-f-related-documents.component';
import { RdFShiftChangeComponent } from './rd-f-shift-change/rd-f-shift-change.component';

const routes: Routes = [
  {
    path: '',
    component: RdFDocumentsReceptionRegisterComponent,
  },
  {
    path: 'record-update/:id',
    component: RdFRecordUpdateComponent,
  },
  // {
  //   path: 'juridical-dictums/:id',
  //   // component: JuridicalDictumsComponent
  // },
  {
    path: 'shift-change/:id',
    component: RdFShiftChangeComponent,
  },
  {
    path: 'related-document-management/:id',
    component: RdFRelatedDocumentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrFlyersRoutingModule {}
