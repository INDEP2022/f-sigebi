import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GpDocumentsRegisterRoutingModule } from './gp-documents-register-routing.module';
import { GpDocumentsRegisterComponent } from './gp-documents-register/gp-documents-register.component';

@NgModule({
  declarations: [GpDocumentsRegisterComponent],
  imports: [CommonModule, GpDocumentsRegisterRoutingModule],
})
export class GpDocumentsRegisterModule {}
