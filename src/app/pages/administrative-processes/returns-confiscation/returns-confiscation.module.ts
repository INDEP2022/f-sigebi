import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReturnsConfiscationRoutingModule } from './returns-confiscation-routing.module';
import { ReturnsConfiscationComponent } from './returns-confiscation/returns-confiscation.component';

@NgModule({
  declarations: [ReturnsConfiscationComponent],
  imports: [CommonModule, ReturnsConfiscationRoutingModule, SharedModule],
})
export class ReturnsConfiscationModule {}
