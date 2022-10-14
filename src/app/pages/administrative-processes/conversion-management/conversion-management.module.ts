import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversionManagementRoutingModule } from './conversion-management-routing.module';
import { ConversionManagementComponent } from './conversion-management/conversion-management.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ConversionManagementComponent],
  imports: [CommonModule, SharedModule, ConversionManagementRoutingModule],
})
export class ConversionManagementModule {}
