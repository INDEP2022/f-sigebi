import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AffailrDetailComponent } from './affailr-detail/affailr-detail.component';
import { AffairListComponent } from './affair-list/affair-list.component';
import { AffairRoutingModule } from './affair-routing.module';

@NgModule({
  declarations: [AffairListComponent, AffailrDetailComponent],
  imports: [CommonModule, AffairRoutingModule],
})
export class AffairModule {}
