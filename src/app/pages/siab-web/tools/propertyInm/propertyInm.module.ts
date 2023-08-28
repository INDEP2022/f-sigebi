import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PropertyInmRoutingModule } from './propertyInm-routing.module';
import { PropertyInmComponent } from './propertyInm/propertyInm.component';

@NgModule({
  declarations: [PropertyInmComponent],
  imports: [CommonModule, PropertyInmRoutingModule, SharedModule],
})
export class PropertyInmModule {}
