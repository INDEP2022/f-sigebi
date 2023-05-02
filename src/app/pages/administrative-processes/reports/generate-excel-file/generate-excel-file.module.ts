import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GenerateExcelFileRoutingModule } from './generate-excel-file-routing.module';
import { GenerateExcelFileComponent } from './generate-excel-file/generate-excel-file.component';

@NgModule({
  declarations: [GenerateExcelFileComponent],
  imports: [CommonModule, GenerateExcelFileRoutingModule, SharedModule],
})
export class GenerateExcelFileModule {}
