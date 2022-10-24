import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { AceptProgrammingFormComponent } from './acept-programming-form/acept-programming-form.component';
import { AceptProgrammingRoutingModule } from './acept-programming-routing.module';
import { ConfirmProgrammingComponent } from './confirm-programming/confirm-programming.component';
import { ElectronicSignatureListComponent } from './electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from './show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from './show-signature-programming/show-signature-programming.component';
import { UploadFilesFormComponent } from './upload-files-form/upload-files-form.component';

@NgModule({
  declarations: [
    AceptProgrammingFormComponent,
    ConfirmProgrammingComponent,
    ShowProgrammingComponent,
    ElectronicSignatureListComponent,
    UploadFilesFormComponent,
    ShowSignatureProgrammingComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    AceptProgrammingRoutingModule,
    ModalModule.forChild(),
  ],
})
export class AceptProgrammingModule {}
