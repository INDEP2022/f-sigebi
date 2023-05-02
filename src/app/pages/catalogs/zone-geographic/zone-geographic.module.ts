import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZoneGeographicFormComponent } from './zone-geographic-form/zone-geographic-form.component';
import { ZoneGeographicListComponent } from './zone-geographic-list/zone-geographic-list.component';
import { ZoneGeographicRoutingModule } from './zone-geographic-routing.module';

@NgModule({
  declarations: [ZoneGeographicFormComponent, ZoneGeographicListComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    ZoneGeographicRoutingModule,
  ],
})
export class ZoneGeographicModule {}
