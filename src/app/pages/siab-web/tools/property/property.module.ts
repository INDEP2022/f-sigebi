import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property/property.component';

@NgModule({
  declarations: [PropertyComponent],
  imports: [CommonModule, PropertyRoutingModule, SharedModule],
})
export class PropertyModule {}
