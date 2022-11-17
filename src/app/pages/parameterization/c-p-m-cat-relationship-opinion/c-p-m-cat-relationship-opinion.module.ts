import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCCatRelationshipOpinionComponent } from './c-p-c-cat-relationship-opinion/c-p-c-cat-relationship-opinion.component';
import { CPMCatRelationshipOpinionRoutingModule } from './c-p-m-cat-relationship-opinion-routing.module';

@NgModule({
  declarations: [CPCCatRelationshipOpinionComponent],
  imports: [CommonModule, CPMCatRelationshipOpinionRoutingModule, SharedModule],
})
export class CPMCatRelationshipOpinionModule {}
