import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RectificationFieldsRoutingModule } from './rectification-fields-routing.module';
import { RectificationFieldsComponent } from './rectification-fields/rectification-fields.component';
import { RectificationFieldsModalComponent } from './rectification-fileds-modal/rectification-fields-modal.component';

@NgModule({
  declarations: [
    RectificationFieldsComponent,
    RectificationFieldsModalComponent,
  ],
  imports: [
    CommonModule,
    RectificationFieldsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    FormLoaderComponent,
  ],
})
export class RectificationFieldsModule {}
