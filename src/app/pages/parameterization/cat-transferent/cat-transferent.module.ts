import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatAuthorityModalComponent } from './cat-authority-modal/cat-authority-modal.component';
import { CatStationModalComponent } from './cat-station-modal/cat-station-modal.component';
import { CatTransferentModalComponent } from './cat-transferent-modal/cat-transferent-modal.component';
import { CatTransferentRoutingModule } from './cat-transferent-routing.module';
import { CatTransferentComponent } from './cat-transferent/cat-transferent.component';

@NgModule({
  declarations: [
    CatTransferentComponent,
    CatTransferentModalComponent,
    CatStationModalComponent,
    CatAuthorityModalComponent,
  ],
  imports: [
    CommonModule,
    CatTransferentRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatTransferentModule {}
