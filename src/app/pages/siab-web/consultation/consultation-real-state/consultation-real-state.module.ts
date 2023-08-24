import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsultationRealStateRoutingModule } from './consultation-real-state-routing.module';
import { ConsultationRealStateComponent } from './consultation-real-state/consultation-real-state.component';

@NgModule({
  declarations: [ConsultationRealStateComponent],
  imports: [CommonModule, ConsultationRealStateRoutingModule, SharedModule],
})
export class ConsultationRealStateModule {}
