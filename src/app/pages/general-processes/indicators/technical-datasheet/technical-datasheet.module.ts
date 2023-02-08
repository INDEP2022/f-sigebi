import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { TechnicalDatasheetRoutingModule } from './technical-datasheet-routing.module';
import { TechnicalDatasheetComponent } from './technical-datasheet/technical-datasheet.component';

@NgModule({
  declarations: [TechnicalDatasheetComponent],
  imports: [CommonModule, TechnicalDatasheetRoutingModule, SharedModule],
})
export class TechnicalDatasheetModule {}
