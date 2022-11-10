import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { CBmFFrCrCRectificationFieldsComponent } from './c-bm-f-fr-cr-c-rectification-fields/c-bm-f-fr-cr-c-rectification-fields.component';
import { CBmFFrCrMRectificationFieldsRoutingModule } from './c-bm-f-fr-cr-m-rectification-fields-routing.module';

@NgModule({
  declarations: [CBmFFrCrCRectificationFieldsComponent],
  imports: [
    CommonModule,
    CBmFFrCrMRectificationFieldsRoutingModule,
    SharedModule,
  ],
})
export class CBmFFrCrMRectificationFieldsModule {}
