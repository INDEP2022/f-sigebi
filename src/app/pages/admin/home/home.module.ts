import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ExampleModalComponent } from './example-modal.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

@NgModule({
  declarations: [HomeComponent, ExampleModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    HomeRoutingModule,
    PreviewDocumentsComponent,
  ],
})
export class HomeModule {}
