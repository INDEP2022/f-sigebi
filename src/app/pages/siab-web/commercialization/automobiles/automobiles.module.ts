import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AutomobilesRoutingModule } from './automobiles-routing.module';
import { automobilesComponent } from './automobiles/automobiles.component';

@NgModule({
  declarations: [automobilesComponent],
  imports: [CommonModule, AutomobilesRoutingModule, SharedModule],
})
export class AutomobilesgModule {}
