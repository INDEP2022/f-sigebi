import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprConfiscatedReceptionRoutingModule } from './jpr-confiscated-reception-routing.module';
import { JprConfiscatedReceptionComponent } from './jpr-confiscated-reception.component';

@NgModule({
  declarations: [JprConfiscatedReceptionComponent],
  imports: [
    CommonModule,
    JprConfiscatedReceptionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprConfiscatedReceptionModule {}
