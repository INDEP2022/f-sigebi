import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { AssetsFilterComponent } from './assets-filter/assets-filter.component';
import { AssetsTabComponent } from './assets-tab/assets-tab.component';
import { DeductivesComponent } from './deductives/deductives.component';
import { DetailAnnexComponent } from './detail-annex/detail-annex.component';
import { NewDocumentFormComponent } from './new-document-form/new-document-form.component';
import { SamplingDetailComponent } from './sampling-detail/sampling-detail.component';
import { UploadExpedientFormComponent } from './upload-expedient-form/upload-expedient-form.component';
import { UploadImagesFormComponent } from './upload-images-form/upload-images-form.component';
import { VerImagenInputComponent } from './ver-imagen-input/ver-imagen-input.component';
import { VerificationsComponent } from './verifications/verifications.component';

@NgModule({
  declarations: [
    AssetsFilterComponent,
    SamplingDetailComponent,
    AssetsTabComponent,
    DeductivesComponent,
    UploadExpedientFormComponent,
    NewDocumentFormComponent,
    UploadImagesFormComponent,
    VerImagenInputComponent,
    VerificationsComponent,
    DetailAnnexComponent,
  ],
  imports: [
    CommonModule,
    ModalModule.forChild(),
    TabsModule,
    SharedModule,
    NgScrollbarModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    AssetsFilterComponent,
    SamplingDetailComponent,
    AssetsTabComponent,
    DeductivesComponent,
    UploadExpedientFormComponent,
    NewDocumentFormComponent,
    UploadImagesFormComponent,
    VerImagenInputComponent,
    VerificationsComponent,
    DetailAnnexComponent,
  ],
})
export class SharedComponentGssModule {}
