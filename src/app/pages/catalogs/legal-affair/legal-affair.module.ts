import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LegalAffairDetailComponent } from './legal-affair-detail/legal-affair-detail.component';
import { LegalAffairListComponent } from './legal-affair-list/legal-affair-list.component';
import { LegalAffairRoutingModule } from './legal-affair-routing.module';

@NgModule({
  declarations: [LegalAffairListComponent, LegalAffairDetailComponent],
  imports: [CommonModule, LegalAffairRoutingModule],
})
export class LegalAffairModule {}
