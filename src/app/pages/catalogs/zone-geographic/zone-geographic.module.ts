import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoneGeographicRoutingModule } from './zone-geographic-routing.module';
import { ZoneGeographicFormComponent } from './zone-geographic-form/zone-geographic-form.component';
import { ZoneGeographicListComponent } from './zone-geographic-list/zone-geographic-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    ZoneGeographicFormComponent,
    ZoneGeographicListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    ZoneGeographicRoutingModule
  ]
})
export class ZoneGeographicModule { }
