import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GpTextChangeFormComponent } from '../gp-text-change/components/gp-text-change-form/gp-text-change-form.component';
import { GpTextChangeModRoutingModule } from './gp-text-change-mod-routing.module';
import { GpTextChangeModComponent } from './gp-text-change-mod/gp-text-change-mod.component';

@NgModule({
  declarations: [GpTextChangeModComponent],
  imports: [
    CommonModule,
    GpTextChangeModRoutingModule,
    GpTextChangeFormComponent,
  ],
})
export class GpTextChangeModModule {}
