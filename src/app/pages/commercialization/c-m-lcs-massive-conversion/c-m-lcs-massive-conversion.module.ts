import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMLcsMassiveConversionRoutingModule } from './c-m-lcs-massive-conversion-routing.module';
import { CMLcsMassiveConversionMainComponent } from './c-m-lcs-massive-conversion-main/c-m-lcs-massive-conversion-main.component';
import { ReworkModalComponent } from './rework-modal/rework-modal.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [CMLcsMassiveConversionMainComponent, ReworkModalComponent],
  imports: [
    CommonModule,
    CMLcsMassiveConversionRoutingModule,
    SharedModule,
    TabsModule,
    CollapseModule.forRoot()
  ],
})
export class CMLcsMassiveConversionModule {}
