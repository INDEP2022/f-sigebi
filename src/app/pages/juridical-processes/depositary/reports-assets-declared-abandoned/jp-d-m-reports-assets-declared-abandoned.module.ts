import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDMReportsAssetsDeclaredAbandonedRoutingModule } from './jp-d-m-reports-assets-declared-abandoned-routing.module';
import { JpDRadaCReportsAssetsDeclaredAbandonedComponent } from './jp-d-rada-c-reports-assets-declared-abandoned/jp-d-rada-c-reports-assets-declared-abandoned.component';

@NgModule({
  declarations: [JpDRadaCReportsAssetsDeclaredAbandonedComponent],
  imports: [
    CommonModule,
    JpDMReportsAssetsDeclaredAbandonedRoutingModule,
    SharedModule,
    UsersSharedComponent,
    GoodsSharedComponent,

    DelegationSharedComponent,
  ],
})
export class JpDMReportsAssetsDeclaredAbandonedModule {}
