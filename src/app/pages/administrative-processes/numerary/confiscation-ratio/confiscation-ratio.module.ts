import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfiscationRatioRoutingModule } from './confiscation-ratio-routing.module';
import { ConfiscationRatioComponent } from './confiscation-ratio/confiscation-ratio.component';

@NgModule({
  declarations: [ConfiscationRatioComponent],
  imports: [
    CommonModule,
    ConfiscationRatioRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    TabsModule,
    PreviewDocumentsComponent,
  ],
})
export class ConfiscationRatioModule {}
