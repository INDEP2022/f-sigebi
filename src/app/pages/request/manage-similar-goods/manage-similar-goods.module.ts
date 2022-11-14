import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ManageSimilarGoodsRoutingModule } from './manage-similar-goods-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ManageSimilarGoodsRoutingModule],
  providers: [BsModalService],
})
export class ManageSimilarGoodsModule {}
