import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpHelpScreenRoutingModule } from './gp-help-screen-routing.module';
import { GpHelpScreenComponent } from './gp-help-screen/gp-help-screen.component';

@NgModule({
  declarations: [GpHelpScreenComponent],
  imports: [CommonModule, GpHelpScreenRoutingModule, SharedModule],
})
export class GpHelpScreenModule {}
