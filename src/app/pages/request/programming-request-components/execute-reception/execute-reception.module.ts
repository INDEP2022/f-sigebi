import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { CancelationGoodFormComponent } from './cancelation-good-form/cancelation-good-form.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { EditGoodFormComponent } from './edit-good-form/edit-good-form.component';
import { ExecuteReceptionFormComponent } from './execute-reception-form/execute-reception-form.component';
import { ExecuteReceptionRoutingModule } from './execute-reception-routing.module';
import { ReschedulingFormComponent } from './rescheduling-form/rescheduling-form.component';

@NgModule({
  declarations: [
    ExecuteReceptionFormComponent,
    DocumentsListComponent,
    ReschedulingFormComponent,
    EditGoodFormComponent,
    CancelationGoodFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedRequestModule,
    TabsModule,
    ExecuteReceptionRoutingModule,
    FormLoaderComponent,
    ModalModule.forChild(),
  ],
})
export class ExecuteReceptionModule {}
