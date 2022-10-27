import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { JpDMReturnRulingRoutingModule } from './jp-d-m-return-ruling-routing.module';
import { JpDRrCReturnRulingComponent } from './jp-d-rr-c-return-ruling/jp-d-rr-c-return-ruling.component';

@NgModule({
  declarations: [JpDRrCReturnRulingComponent],
  imports: [CommonModule, JpDMReturnRulingRoutingModule, SharedModule],
})
export class JpDMReturnRulingModule {}
