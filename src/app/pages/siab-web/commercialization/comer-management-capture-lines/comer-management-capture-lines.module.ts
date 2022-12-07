import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ComerManagementCaptureLinesComponent } from './comer-management-capture-lines-form/comer-management-capture-lines-form.component';
import { ComerManagementCaptureLinesRoutingModule } from './comer-management-capture-lines-routing.module';

@NgModule({
  declarations: [ComerManagementCaptureLinesComponent],
  imports: [
    CommonModule,
    ComerManagementCaptureLinesRoutingModule,
    SharedModule,
  ],
})
export class ComerManagementCaptureLinesModule {}
