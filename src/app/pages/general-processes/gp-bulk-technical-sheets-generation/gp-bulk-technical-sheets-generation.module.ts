import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpBulkTechnicalSheetsGenerationRoutingModule } from './gp-bulk-technical-sheets-generation-routing.module';
import { GpBulkTechnicalSheetsGenerationComponent } from './gp-bulk-technical-sheets-generation/gp-bulk-technical-sheets-generation.component';

@NgModule({
  declarations: [GpBulkTechnicalSheetsGenerationComponent],
  imports: [
    CommonModule,
    GpBulkTechnicalSheetsGenerationRoutingModule,
    SharedModule,
  ],
})
export class GpBulkTechnicalSheetsGenerationModule {}
