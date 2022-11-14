import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CPMNumeraryParameterizationRoutingModule } from './c-p-m-numerary-parameterization-routing.module';
import { CPNpCNumeraryParameterizationComponent } from './c-p-np-c-numerary-parameterization/c-p-np-c-numerary-parameterization.component';
import { ModalNumeraryParameterizationComponent } from './modal-numerary-parameterization/modal-numerary-parameterization.component';

@NgModule({
  declarations: [
    CPNpCNumeraryParameterizationComponent,
    ModalNumeraryParameterizationComponent,
  ],
  imports: [
    CommonModule,
    CPMNumeraryParameterizationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMNumeraryParameterizationModule {}
