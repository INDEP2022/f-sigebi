import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ElectronicSignatureFirmModalComponent } from './electronic-signatures-main-firm-modal/electronic-signatures-main-firm-modal.component';
import { ElectronicSignaturesMainComponent } from './electronic-signatures-main/electronic-signatures-main.component';
import { ElectronicSignaturesRoutingModule } from './electronic-signatures-routing.module';

@NgModule({
  declarations: [
    ElectronicSignaturesMainComponent,
    ElectronicSignatureFirmModalComponent,
  ],
  imports: [
    CommonModule,
    ElectronicSignaturesRoutingModule,
    SharedModule,
    TabsModule,
    AlertModule.forRoot(),
    ModalModule.forChild(),
    NgScrollbarModule,
    FormLoaderComponent,
  ],
})
export class ElectronicSignaturesModule {}
