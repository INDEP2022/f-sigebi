import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { CatRelationshipOpinionModalComponent } from './cat-relationship-opinion-modal/cat-relationship-opinion-modal.component';
import { CatRelationshipOpinionRoutingModule } from './cat-relationship-opinion-routing.module';
import { CatRelationshipOpinionComponent } from './cat-relationship-opinion/cat-relationship-opinion.component';

@NgModule({
  declarations: [
    CatRelationshipOpinionComponent,
    CatRelationshipOpinionModalComponent,
  ],
  imports: [
    CommonModule,
    CatRelationshipOpinionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatRelationshipOpinionModule {}
