import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { FormSearchHandlerComponent } from './form-search-handler.component';

@NgModule({
  declarations: [FormSearchHandlerComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
  exports: [FormSearchHandlerComponent],
})
export class FormSearchHandlerModule {}
