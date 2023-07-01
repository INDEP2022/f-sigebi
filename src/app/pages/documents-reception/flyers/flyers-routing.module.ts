import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsReceptionRegisterComponent } from './documents-reception-register/documents-reception-register.component';
import { RecordUpdateComponent } from './record-update/record-update.component';
// import { RelatedDocumentsDictationComponent } from './related-documents/related-documents-dictation.component';
import { RelatedDocumentsRelationComponent } from './related-documents/related-document-relation/related-documents-relation.component';
import { RelatedDocumentsComponent } from './related-documents/related-documents.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentsReceptionRegisterComponent,
  },
  {
    path: 'record-update/:id',
    component: RecordUpdateComponent,
  },
  // {
  //   path: 'juridical-dictums/:id',
  //   // component: JuridicalDictumsComponent
  // },
  // {
  //   path: 'shift-change/:id',
  //   component: RdFShiftChangeComponent,
  // },
  {
    path: 'related-document-management/:id',
    component: RelatedDocumentsComponent,
  },
  {
    path: 'related-document-management-relation/:id',
    component: RelatedDocumentsRelationComponent,
  },
  // {
  //   path: 'related-document-management-dictation/:id',
  //   component: RelatedDocumentsDictationComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlyersRoutingModule {}
