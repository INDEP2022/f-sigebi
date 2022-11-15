import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { NewDocumentFormComponent } from './new-document-form/new-document-form.component';
import { SamplingAssetsFormComponent } from './sampling-assets-form/sampling-assets-form.component';
import { SamplingAssetsRoutingModule } from './sampling-assets-routing.module';
import { SelectInputComponent } from './select-input/select-input.component';
import { UploadExpedientFormComponent } from './upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from './upload-images-form/upload-images-form.component';
import { VerImagenInputComponent } from './ver-imagen-input/ver-imagen-input.component';

@NgModule({
  declarations: [
    SamplingAssetsFormComponent,
    SelectInputComponent,
    UploadExpedientFormComponent,
    NewDocumentFormComponent,
    UploadImagesFormComponent,
    VerImagenInputComponent,
  ],
  imports: [
    CommonModule,
    SamplingAssetsRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    TabsModule,
  ],
})
export class SamplingAssetsModule {}
