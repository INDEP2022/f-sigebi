import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormSearchHandlerModule } from '../../juridical-processes/shared/form-search-handler/form-search-handler.module';
import { CreateActaComponent } from './create-acta/create-acta.component';
import { FindActaGoodComponent } from './find-acta-good/find-acta-good.component';
import { ProceedingsConversionDetailComponent } from './proceedings-conversion-detail/proceedings-conversion-detail.component';
import { ProceedingsConversionModalComponent } from './proceedings-conversion-modal/proceedings-conversion-modal.component';
import { ProceedingsConversionRoutingModule } from './proceedings-conversion-routing.module';
import { ProceedingsConversionComponent } from './proceedings-conversion/proceedings-conversion.component';

@NgModule({
  declarations: [
    ProceedingsConversionComponent,
    ProceedingsConversionDetailComponent,
    ProceedingsConversionModalComponent,
    FindActaGoodComponent,
    CreateActaComponent,
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
    AccordionModule,
    FormLoaderComponent,
    FormSearchHandlerModule,
    TooltipModule,
  ],
})
export class ProceedingsConversionModule {}
