import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxCurrencyModule } from 'ngx-currency';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { ComerRediModalComponent } from './comer-redi-modal/comer-redi-modal.component';
import { InvoiceRectificationProcessRoutingModule } from './invoice-rectification-process-routing.module';
import { InvoiceRectificationProcessComponent } from './invoice-rectification-process/invoice-rectification-process.component';
import { NewImageModalComponent } from './new-image-modal/new-image-modal.component';
export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: false,
};

@NgModule({
  declarations: [
    InvoiceRectificationProcessComponent,
    NewImageModalComponent,
    ComerRediModalComponent,
  ],
  imports: [
    CommonModule,
    InvoiceRectificationProcessRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
    UsersSharedComponent,
    FormLoaderComponent,
    TooltipModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class InvoiceRectificationProcessModule {}
