import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { LocationGeneralArchiveRoutingModule } from './location-general-archive-routing.module';
import { LocationGeneralArchiveComponent } from './location-general-archive/location-general-archive.component';
import { LocationGeneralRenderComponent } from './location-general-archive/render-component/location-general-render/location-general-render.component';

@NgModule({
  declarations: [
    LocationGeneralArchiveComponent,
    LocationGeneralRenderComponent,
  ],
  imports: [
    CommonModule,
    LocationGeneralArchiveRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class LocationGeneralArchiveModule {}
