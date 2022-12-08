import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrackerFormRoutingModule } from './tracker-form-routing.module';
import { TrackerFormComponent } from './tracker-form/tracker-form.component';

@NgModule({
  declarations: [TrackerFormComponent],
  imports: [CommonModule, TrackerFormRoutingModule, SharedModule],
})
export class TrackerFormModule {}
