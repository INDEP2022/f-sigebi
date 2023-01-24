import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { SharedRequestModule } from '../../request/shared-request/shared-request.module';
import { AfsSharedComponentsModule } from '../afs-shared-components/afs-shared-components.module';
import { SaveAnswerComponent } from './save-answer/save-answer.component';
import { SaveResponsibleAnswerRoutingModule } from './save-responsible-answer-routing.module';
import { TextareaModalComponent } from './textarea-modal/textarea-modal.component';
import { UploadDocumentarySupportComponent } from './upload-documentary-support/upload-documentary-support.component';

@NgModule({
  declarations: [
    SaveAnswerComponent,
    UploadDocumentarySupportComponent,
    TextareaModalComponent,
  ],
  imports: [
    CommonModule,
    SaveResponsibleAnswerRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedRequestModule,
    AfsSharedComponentsModule,
    TabsModule,
  ],
})
export class SaveResponsibleAnswerModule {}
