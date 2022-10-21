import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProceedingsConversionDetailComponent } from './proceedings-conversion-detail/proceedings-conversion-detail.component';
import { ProceedingsConversionRoutingModule } from './proceedings-conversion-routing.module';
import { ProceedingsConversionComponent } from './proceedings-conversion/proceedings-conversion.component';

@NgModule({
  declarations: [
    ProceedingsConversionComponent,
    ProceedingsConversionDetailComponent,
  ],
  exports: [
    ProceedingsConversionComponent,
    ProceedingsConversionDetailComponent,
  ],
  imports: [
    CommonModule,
    ProceedingsConversionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class ProceedingsConversionModule {}
