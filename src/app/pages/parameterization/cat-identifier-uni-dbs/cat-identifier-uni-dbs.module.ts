import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CatIdentifierUniDbsRoutingModule } from './cat-identifier-uni-dbs-routing.module';
import { CatIdentifierUniDbsComponent } from './cat-identifier-uni-dbs/cat-identifier-uni-dbs.component';
import { ModalIdentifierUnivDbs } from './modal-cat-identifier-uni-bds/modal-cat-identifier-uni-dbs.component';

@NgModule({
  declarations: [CatIdentifierUniDbsComponent, ModalIdentifierUnivDbs],
  imports: [CommonModule, CatIdentifierUniDbsRoutingModule, SharedModule],
})
export class CatIdentifierUniDbsModule {}
