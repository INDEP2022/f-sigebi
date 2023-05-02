import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CatIdentifierUniDbsRoutingModule } from './cat-identifier-uni-dbs-routing.module';
import { CatIdentifierUniDbsComponent } from './cat-identifier-uni-dbs/cat-identifier-uni-dbs.component';

@NgModule({
  declarations: [CatIdentifierUniDbsComponent],
  imports: [CommonModule, CatIdentifierUniDbsRoutingModule, SharedModule],
})
export class CatIdentifierUniDbsModule {}
