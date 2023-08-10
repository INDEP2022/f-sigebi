import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchSchedulesFormComponent } from './search-schedules-form/search-schedules-form.component';
import { SearchSchedulesRoutingModule } from './search-schedules-routing';

@NgModule({
  declarations: [SearchSchedulesFormComponent],

  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    SearchSchedulesRoutingModule,
    FormLoaderComponent,
  ],
})
export class SearchScheduleModule {}
