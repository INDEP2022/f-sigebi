import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GpTextChangeFormComponent } from './components/gp-text-change-form/gp-text-change-form.component';
import { GpTextChangeRoutingModule } from './gp-text-change-routing.module';
import { GpTextChangeComponent } from './gp-text-change/gp-text-change.component';

@NgModule({
  declarations: [GpTextChangeComponent],
  imports: [CommonModule, GpTextChangeRoutingModule, GpTextChangeFormComponent],
})
export class GpTextChangeModule {}
