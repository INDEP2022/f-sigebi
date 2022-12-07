import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpValidStatusesRoutingModule } from './gp-valid-statuses-routing.module';
import { GpValidStatusesComponent } from './gp-valid-statuses/gp-valid-statuses.component';

@NgModule({
  declarations: [GpValidStatusesComponent],
  imports: [
    CommonModule,
    GpValidStatusesRoutingModule,
    SharedModule,
    TabsModule,
  ],
})
export class GpValidStatusesModule {}
