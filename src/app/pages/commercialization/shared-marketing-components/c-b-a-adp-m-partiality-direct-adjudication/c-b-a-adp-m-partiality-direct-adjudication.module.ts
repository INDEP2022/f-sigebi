import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CBAAdpCPartialityDirectAdjudicationMainComponent } from './c-b-a-adp-c-partiality-direct-adjudication-main/c-b-a-adp-c-partiality-direct-adjudication-main.component';
import { CBAAdpMPartialityDirectAdjudicationRoutingModule } from './c-b-a-adp-m-partiality-direct-adjudication-routing.module';

@NgModule({
  declarations: [CBAAdpCPartialityDirectAdjudicationMainComponent],
  imports: [
    CommonModule,
    CBAAdpMPartialityDirectAdjudicationRoutingModule,
    SharedModule,
    NgScrollbarModule,
    TabsModule,
  ],
})
export class CBAAdpMPartialityDirectAdjudicationModule {}
