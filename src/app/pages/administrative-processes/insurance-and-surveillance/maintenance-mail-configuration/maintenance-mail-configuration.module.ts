import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MailBodyListDataComponent } from './body-mail-list/body-mail-list.component';
import { CreateOrEditEmailMaintenencekDialogComponent } from './components/create-or-edit-maintenence-mail-dialog/create-or-edit-maintenence-mail-dialog.component';
import { MaintenanceMailConfigurationRoutingModule } from './maintenance-mail-configuration-routing.module';
import { MaintenanceMailConfigurationComponent } from './maintenance-mail-configuration/maintenance-mail-configuration.component';
@NgModule({
  declarations: [
    MaintenanceMailConfigurationComponent,
    CreateOrEditEmailMaintenencekDialogComponent,
    MailBodyListDataComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceMailConfigurationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    CustomSelectComponent,
  ],
})
export class MaintenanceMailConfigurationModule {}
