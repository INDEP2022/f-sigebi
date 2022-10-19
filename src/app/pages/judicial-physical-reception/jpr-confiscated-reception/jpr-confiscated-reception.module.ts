import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprConfiscatedReceptionRoutingModule } from './jpr-confiscated-reception-routing.module';
import { JprConfiscatedReceptionComponent } from './jpr-confiscated-reception.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprConfiscatedReceptionComponent
  ],
  imports: [
    CommonModule,
    JprConfiscatedReceptionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprConfiscatedReceptionModule { }
