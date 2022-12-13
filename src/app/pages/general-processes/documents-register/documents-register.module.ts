import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DocumentsRegisterRoutingModule } from './documents-register-routing.module';
import { DocumentsRegisterComponent } from './documents-register/documents-register.component';

@NgModule({
  declarations: [DocumentsRegisterComponent],
  imports: [CommonModule, DocumentsRegisterRoutingModule],
})
export class DocumentsRegisterModule {}
