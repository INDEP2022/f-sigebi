import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpFtMTechnicalSheetsRoutingModule } from './fdp-ft-m-technical-sheets-routing.module';
import { FdpFtCTechnicalSheetsComponent } from './technical-sheets/fdp-ft-c-technical-sheets.component';

@NgModule({
  declarations: [FdpFtCTechnicalSheetsComponent],
  imports: [
    CommonModule,
    FdpFtMTechnicalSheetsRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class FdpFtMTechnicalSheetsModule {}
