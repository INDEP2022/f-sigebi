import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { BulkTechnicalSheetsGenerationRoutingModule } from './bulk-technical-sheets-generation-routing.module';
import { BulkTechnicalSheetsGenerationComponent } from './bulk-technical-sheets-generation/bulk-technical-sheets-generation.component';

@NgModule({
  declarations: [BulkTechnicalSheetsGenerationComponent],
  imports: [
    CommonModule,
    BulkTechnicalSheetsGenerationRoutingModule,
    SharedModule,
  ],
})
export class BulkTechnicalSheetsGenerationModule {}
