import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CatRelationshipOpinionRoutingModule } from './cat-relationship-opinion-routing.module';
import { CatRelationshipOpinionComponent } from './cat-relationship-opinion/cat-relationship-opinion.component';

@NgModule({
  declarations: [CatRelationshipOpinionComponent],
  imports: [CommonModule, CatRelationshipOpinionRoutingModule, SharedModule],
})
export class CatRelationshipOpinionModule {}
