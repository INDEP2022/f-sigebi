import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfiscatedReceptionRoutingModule } from './confiscated-reception-routing.module';
import { ConfiscatedReceptionComponent } from './confiscated-reception.component';

@NgModule({
  declarations: [ConfiscatedReceptionComponent],
  imports: [
    CommonModule,
    ConfiscatedReceptionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class ConfiscatedReceptionModule {}
