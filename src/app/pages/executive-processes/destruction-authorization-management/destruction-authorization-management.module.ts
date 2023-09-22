import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DestructionAuthorizationManagementRoutingModule } from './destruction-authorization-management-routing.module';
import { DestructionAuthorizationManagementComponent } from './destruction-authorization-management/destruction-authorization-management.component';
import { DestructionAuthorizationComponent } from './destruction-authorization/destruction-authorization.component';
import { destructionAuthReducer } from './destruction-authorization/store/destruction-auth.reducer';
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
    StoreModule.forFeature('destructionAuth', destructionAuthReducer),
    PreviewDocumentsComponent,
    TooltipModule.forRoot(),
  ],
})
export class DestructionAuthorizationManagementModule {}
