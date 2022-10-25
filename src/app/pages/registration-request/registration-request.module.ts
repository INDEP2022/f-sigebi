import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrationRequestFormComponent } from './registration-request-form/registration-request-form.component';
import { RegistrationRequestRoutingModule } from './registration-request-routing.module';
import { AssociateFileComponent } from './associate-file/associate-file.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [RegistrationRequestFormComponent, AssociateFileComponent],
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    RegistrationRequestRoutingModule,
    ModalModule.forRoot(),
  ],
})
export class RegistrationRequestModule {}
