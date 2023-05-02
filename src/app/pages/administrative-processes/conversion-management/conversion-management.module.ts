import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ConversionManagementRoutingModule } from './conversion-management-routing.module';
import { ConversionManagementComponent } from './conversion-management/conversion-management.component';

@NgModule({
  declarations: [ConversionManagementComponent],
  imports: [CommonModule, SharedModule, ConversionManagementRoutingModule],
})
export class ConversionManagementModule {}
