import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DestructionAuthorizationManagementRoutingModule } from './destruction-authorization-management-routing.module';
import { DestructionAuthorizationManagementComponent } from './destruction-authorization-management/destruction-authorization-management.component';
import { DestructionAuthorizationComponent } from './destruction-authorization/destruction-authorization.component';
import { EmailModalComponent } from './email-modal/email-modal.component';
import { GoodByProceedingsModalComponent } from './good-by-proceedings-modal/good-by-proceedings-modal.component';
import { ProceedingsModalComponent } from './proceedings-modal/proceedings-modal.component';

@NgModule({
  declarations: [
    DestructionAuthorizationManagementComponent,
    DestructionAuthorizationComponent,
    ProceedingsModalComponent,
    GoodByProceedingsModalComponent,
    EmailModalComponent,
  ],
  imports: [
    CommonModule,
    DestructionAuthorizationManagementRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    AlertModule.forRoot(),
  ],
})
export class DestructionAuthorizationManagementModule {}
