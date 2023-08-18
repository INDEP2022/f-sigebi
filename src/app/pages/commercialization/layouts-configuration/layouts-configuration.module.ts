import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutsConfigurationModalComponent } from './layouts-configuration-modal/layouts-configuration-modal.component';
import { LayoutsConfigurationRoutingModule } from './layouts-configuration-routing.module';
import { LayoutsConfigurationComponent } from './layouts-configuration.component';
import { LayoutsStructureConfigurationModalComponent } from './layouts-structure-configuration-modal/layouts-structure-configuration-modal.component';

@NgModule({
  declarations: [
    LayoutsConfigurationComponent,
    LayoutsConfigurationModalComponent,
    LayoutsStructureConfigurationModalComponent,
  ],
  imports: [
    CommonModule,
    LayoutsConfigurationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class LayoutsConfigurationModule {}
