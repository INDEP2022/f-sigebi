import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module'; 

import { CBmFFrCrMRectificationFieldsRoutingModule } from './c-bm-f-fr-cr-m-rectification-fields-routing.module';
import { CBmFFrCrCRectificationFieldsComponent } from './c-bm-f-fr-cr-c-rectification-fields/c-bm-f-fr-cr-c-rectification-fields.component';


@NgModule({
  declarations: [
    CBmFFrCrCRectificationFieldsComponent
  ],
  imports: [
    CommonModule,
    CBmFFrCrMRectificationFieldsRoutingModule,
    SharedModule
  ]
})
export class CBmFFrCrMRectificationFieldsModule { }
