import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalNumeraryParameterizationComponent } from './modal-numerary-parameterization/modal-numerary-parameterization.component';
import { NumeraryParameterizationRoutingModule } from './numerary-parameterization-routing.module';
import { NumeraryParameterizationComponent } from './numerary-parameterization/numerary-parameterization.component';

@NgModule({
  declarations: [
    NumeraryParameterizationComponent,
    ModalNumeraryParameterizationComponent,
  ],
  imports: [
    CommonModule,
    NumeraryParameterizationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class NumeraryParameterizationModule {}
