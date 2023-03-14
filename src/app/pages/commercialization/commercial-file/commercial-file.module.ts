import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { GoodsTableSharedComponent } from 'src/app/@standalone/shared-forms/goods-table-shared/goods-table-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommercialFileRoutingModule } from './commercial-file-routing.module';
import { CommercialFileComponent } from './commercial-file/commercial-file.component';

@NgModule({
  declarations: [CommercialFileComponent],
  imports: [
    CommonModule,
    CommercialFileRoutingModule,
    SharedModule,
    PreviewDocumentsComponent,
    GoodsTableSharedComponent,
  ],
})
export class CommercialFileModule {}
