import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { SharedRequestModule } from '../../request/shared-request/shared-request.module';
import { AfsSharedComponentsModule } from '../afs-shared-components/afs-shared-components.module';
import { DictateAssetsStudyRoutingModule } from './dictate-assets-study-routing.module';
import { DictateAssetsComponent } from './dictate-assets/dictate-assets.component';
import { GenerateAutorizationComponent } from './generate-autorization/generate-autorization.component';
import { PrintDictateComponent } from './print-dictate/print-dictate.component';

@NgModule({
  declarations: [
    DictateAssetsComponent,
    GenerateAutorizationComponent,
    PrintDictateComponent,
  ],
  imports: [
    CommonModule,
    DictateAssetsStudyRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    AfsSharedComponentsModule,
    SharedRequestModule,
    TabsModule,
  ],
})
export class DictateAssetsStudyModule {}
