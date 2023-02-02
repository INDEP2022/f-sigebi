import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DataSheetRoutingModule } from './data-sheet-routing.module';
import { DataSheetComponent } from './data-sheet/data-sheet.component';

@NgModule({
  declarations: [DataSheetComponent],
  imports: [CommonModule, DataSheetRoutingModule, SharedModule],
})
export class DataSheetModule {}
