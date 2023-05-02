import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartialityDirectAdjudicationMainComponent } from './partiality-direct-adjudication-main/partiality-direct-adjudication-main.component';
import { PartialityDirectAdjudicationRoutingModule } from './partiality-direct-adjudication-routing.module';

@NgModule({
  declarations: [PartialityDirectAdjudicationMainComponent],
  imports: [
    CommonModule,
    PartialityDirectAdjudicationRoutingModule,
    SharedModule,
    NgScrollbarModule,
    TabsModule,
  ],
})
export class PartialityDirectAdjudicationModule {}
