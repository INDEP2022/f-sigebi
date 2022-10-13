import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DateRangeSharedComponent } from 'src/app/@standalone/shared-forms/date-range-shared/date-range-shared.component';

import { PeRddgBreaMAssetsReceivedAdmonRoutingModule } from './pe-rddg-brea-m-assets-received-admon-routing.module';
import { PeRddgBreaCAssetsReceivedAdmonComponent } from './pe-rddg-brea-c-assets-received-admon/pe-rddg-brea-c-assets-received-admon.component';


@NgModule({
  declarations: [
    PeRddgBreaCAssetsReceivedAdmonComponent
  ],
  imports: [
    CommonModule,
    PeRddgBreaMAssetsReceivedAdmonRoutingModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    DateRangeSharedComponent
  ]
})
export class PeRddgBreaMAssetsReceivedAdmonModule { }
