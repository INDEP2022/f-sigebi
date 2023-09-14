import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatFileForGoodRoutingModule } from './flat-file-for-good-routing.module';
import { FlatFileForGoodComponent } from './flat-file-for-good/flat-file-for-good.component';

@NgModule({
  declarations: [FlatFileForGoodComponent],
  imports: [
    CommonModule,
    FlatFileForGoodRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class FlatFileForGoodModule {}
