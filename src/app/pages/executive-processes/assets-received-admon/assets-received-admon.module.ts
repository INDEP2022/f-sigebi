import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssetsReceivedAdmonRoutingModule } from './assets-received-admon-routing.module';
import { AssetsReceivedAdmonComponent } from './assets-received-admon/assets-received-admon.component';

@NgModule({
  declarations: [AssetsReceivedAdmonComponent],
  imports: [
    CommonModule,
    AssetsReceivedAdmonRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DateRangeSharedComponent,
    ModalModule.forChild(),
  ],
})
export class AssetsReceivedAdmonModule {}
