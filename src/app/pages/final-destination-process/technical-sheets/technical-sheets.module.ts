import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { TechnicalSheetsRoutingModule } from './technical-sheets-routing.module';
import { TechnicalSheetsComponent } from './technical-sheets/technical-sheets.component';

@NgModule({
  declarations: [TechnicalSheetsComponent],
  imports: [
    CommonModule,
    TechnicalSheetsRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class TechnicalSheetsModule {}
