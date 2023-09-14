import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'src/app/utils/file-upload/file-upload.module';
import { ChildComponent } from './child/child.component';
import { ExampleModalComponent } from './example-modal.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ListDataComponent } from './list-data/list-data.component';
import { ModalNestedComponent } from './modal-nest.component';

@NgModule({
  declarations: [
    HomeComponent,
    ExampleModalComponent,
    ChildComponent,
    ModalNestedComponent,
    ListDataComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TooltipModule,
    ModalModule.forChild(),
    TabsModule,
    HomeRoutingModule,
    PreviewDocumentsComponent,
    FileUploadModule,
    ClipboardModule,
    FormLoaderComponent,
  ],
})
export class HomeModule {}
