import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCCatIdentifierUniDbsComponent } from './c-p-c-cat-identifier-uni-dbs/c-p-c-cat-identifier-uni-dbs.component';
import { CPMCatIdentifierUniDbsRoutingModule } from './c-p-m-cat-identifier-uni-dbs-routing.module';

@NgModule({
  declarations: [CPCCatIdentifierUniDbsComponent],
  imports: [CommonModule, CPMCatIdentifierUniDbsRoutingModule, SharedModule],
})
export class CPMCatIdentifierUniDbsModule {}
