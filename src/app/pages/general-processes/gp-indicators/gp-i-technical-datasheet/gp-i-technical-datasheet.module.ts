import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpITechnicalDatasheetRoutingModule } from './gp-i-technical-datasheet-routing.module';
import { GpITechnicalDatasheetComponent } from './gp-i-technical-datasheet/gp-i-technical-datasheet.component';

@NgModule({
  declarations: [GpITechnicalDatasheetComponent],
  imports: [CommonModule, GpITechnicalDatasheetRoutingModule, SharedModule],
})
export class GpITechnicalDatasheetModule {}
