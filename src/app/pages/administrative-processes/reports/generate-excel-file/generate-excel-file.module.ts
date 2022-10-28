import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateExcelFileRoutingModule } from './generate-excel-file-routing.module';
import { GenerateExcelFileComponent } from './generate-excel-file/generate-excel-file.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    GenerateExcelFileComponent
  ],
  imports: [
    CommonModule,
    GenerateExcelFileRoutingModule,
    SharedModule,
  ]
})
export class GenerateExcelFileModule { }
