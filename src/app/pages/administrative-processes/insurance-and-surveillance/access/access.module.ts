import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AccessRoutingModule } from './access-routing.module';
import { AdduserComponent } from './user-access/adduser/adduser.component';
import { UserAccessComponent } from './user-access/user-access.component';
@NgModule({
  declarations: [UserAccessComponent, AdduserComponent],
  imports: [
    CommonModule,
    AccessRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class AccessModule {}
