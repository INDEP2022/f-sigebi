import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { HelpScreenRoutingModule } from './help-screen-routing.module';
import { HelpScreenComponent } from './help-screen/help-screen.component';

@NgModule({
  declarations: [HelpScreenComponent],
  imports: [CommonModule, HelpScreenRoutingModule, SharedModule],
})
export class HelpScreenModule {}
