import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMLayoutsConfigurationRoutingModule } from './c-m-layouts-configuration-routing.module';
import { CMLayoutsConfigurationComponent } from './c-m-layouts-configuration.component';

@NgModule({
  declarations: [CMLayoutsConfigurationComponent],
  imports: [
    CommonModule,
    CMLayoutsConfigurationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class CMLayoutsConfigurationModule {}
