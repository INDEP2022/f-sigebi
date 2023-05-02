import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';
import { GenerateSamplingSupervisionRoutingModule } from './generate-sampling-supervision-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GenerateSamplingSupervisionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedRequestModule,
  ],
  exports: [],
})
export class GenerateSamplingSupervisionModule {}
