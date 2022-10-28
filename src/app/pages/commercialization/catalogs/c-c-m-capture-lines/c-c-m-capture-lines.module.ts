import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCCCaptureLinesMainComponent } from './c-c-c-capture-lines-main/c-c-c-capture-lines-main.component';
import { CCMCaptureLinesRoutingModule } from './c-c-m-capture-lines-routing.module';

@NgModule({
  declarations: [CCCCaptureLinesMainComponent],
  imports: [
    CommonModule,
    CCMCaptureLinesRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class CCMCaptureLinesModule {}
