import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutsConfigurationRoutingModule } from './layouts-configuration-routing.module';
import { LayoutsConfigurationComponent } from './layouts-configuration.component';

@NgModule({
  declarations: [LayoutsConfigurationComponent],
  imports: [
    CommonModule,
    LayoutsConfigurationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class LayoutsConfigurationModule {}
