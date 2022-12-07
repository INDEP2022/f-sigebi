import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCManagementCaptureLinesComponent } from './sw-comer-c-management-capture-lines/sw-comer-c-management-capture-lines.component';
import { SwComerMManagementCaptureLinesRoutingModule } from './sw-comer-m-management-capture-lines-routing.module';

@NgModule({
  declarations: [SwComerCManagementCaptureLinesComponent],
  imports: [
    CommonModule,
    SwComerMManagementCaptureLinesRoutingModule,
    SharedModule,
  ],
})
export class SwComerMManagementCaptureLinesModule {}
