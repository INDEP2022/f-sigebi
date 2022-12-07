import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureLinesMainComponent } from './capture-lines-main/capture-lines-main.component';
import { CaptureLinesRoutingModule } from './capture-lines-routing.module';

@NgModule({
  declarations: [CaptureLinesMainComponent],
  imports: [
    CommonModule,
    CaptureLinesRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class CaptureLinesModule {}
