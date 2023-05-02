import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'src/app/utils/file-upload/file-upload.module';
import { ConsultTxtComponent } from './components/consult-txt/consult-txt.component';
import { GoodsViewFinderShowComponent } from './components/goods-view-finder-show/goods-view-finder-show.component';
import { GoodsViewFinderFormRoutingModule } from './goods-view-finder-form-routing.module';
import { GoodsViewFinderFormComponent } from './goods-view-finder-form/goods-view-finder-form.component';

@NgModule({
  declarations: [
    GoodsViewFinderFormComponent,
    ConsultTxtComponent,
    GoodsViewFinderShowComponent,
  ],
  imports: [
    CommonModule,
    GoodsViewFinderFormRoutingModule,
    SharedModule,
    TabsModule,
    FileUploadModule,
    ModalModule.forChild(),
    CarouselModule.forRoot(),
  ],
})
export class GoodsViewFinderFormModule {}
