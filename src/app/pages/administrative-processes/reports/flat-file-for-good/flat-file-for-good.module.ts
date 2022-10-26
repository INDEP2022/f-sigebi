import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlatFileForGoodRoutingModule } from './flat-file-for-good-routing.module';
import { FlatFileForGoodComponent } from './flat-file-for-good/flat-file-for-good.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    FlatFileForGoodComponent
  ],
  imports: [
    CommonModule,
    FlatFileForGoodRoutingModule,
    SharedModule,
  ]
})
export class FlatFileForGoodModule { }
