import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { AnnexJAssetsClassificationComponent } from './annex-j-assets-classification/annex-j-assets-classification.component';
import { AssetsClassificationRoutingModule } from './assets-classification-routing-module';
import { AssetsClassificationComponent } from './assets-classification/assets-classification.component';
import { ClassificationAnnexedSignComponent } from './classification-annexed-sign/classification-annexed-sign.component';

@NgModule({
  declarations: [
    AssetsClassificationComponent,
    AnnexJAssetsClassificationComponent,
    ClassificationAnnexedSignComponent,
  ],
  imports: [
    CommonModule,
    AssetsClassificationRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedComponentGssModule,
    TabsModule,
  ],
})
export class AssetsClassificationModule {}
