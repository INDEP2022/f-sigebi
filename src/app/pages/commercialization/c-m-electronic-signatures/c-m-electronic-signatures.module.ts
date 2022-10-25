import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CMElectronicSignaturesMainComponent } from './c-m-electronic-signatures-main/c-m-electronic-signatures-main.component';
import { CMElectronicSignaturesRoutingModule } from './c-m-electronic-signatures-routing.module';

@NgModule({
  declarations: [CMElectronicSignaturesMainComponent],
  imports: [
    CommonModule,
    CMElectronicSignaturesRoutingModule,
    SharedModule,
    TabsModule,
    AlertModule.forRoot(),
    ModalModule.forChild(),
  ],
})
export class CMElectronicSignaturesModule {}
