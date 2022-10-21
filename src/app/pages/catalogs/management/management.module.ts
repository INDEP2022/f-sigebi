import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManagementFormComponent } from './management-form/management-form.component';
import { ManagementRoutingModule } from './management-routing.module';
import { ManagementsListComponent } from './managements-list/managements-list.component';

@NgModule({
  declarations: [ManagementsListComponent, ManagementFormComponent],

  imports: [
    CommonModule,
    SharedModule,
    ManagementRoutingModule,
    ModalModule.forChild(),
  ],
})
export class ManagementModule {}
