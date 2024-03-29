import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleNotifyFormComponent } from './schedule-notify-form/schedule-notify-form.component';
import { ScheduleNotifyRoutingModule } from './schedule-notify-routing.module';

@NgModule({
  declarations: [ScheduleNotifyFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    ScheduleNotifyRoutingModule,
    FormLoaderComponent,
  ],
})
export class ScheduleNotifyModule {}
