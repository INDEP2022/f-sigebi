import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AfsSharedComponentsModule } from '../afs-shared-components/afs-shared-components.module';
import { ClasifyProgrammedGoodsRoutingModule } from './clasify-programmed-goods-routing.module';
import { ClasifyProgrammedGoodsComponent } from './clasify-programmed-goods/clasify-programmed-goods.component';

@NgModule({
  declarations: [ClasifyProgrammedGoodsComponent],
  imports: [
    CommonModule,
    ClasifyProgrammedGoodsRoutingModule,
    SharedModule,
    AfsSharedComponentsModule,
    ReactiveFormsModule,
  ],
})
export class ClasifyProgrammedGoodsModule {}
