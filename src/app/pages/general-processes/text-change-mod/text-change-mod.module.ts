import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TextChangeFormComponent } from '../text-change/components/text-change-form/text-change-form.component';
import { TextChangeModRoutingModule } from './text-change-mod-routing.module';
import { TextChangeModComponent } from './text-change-mod/text-change-mod.component';

@NgModule({
  declarations: [TextChangeModComponent],
  imports: [CommonModule, TextChangeModRoutingModule, TextChangeFormComponent],
})
export class TextChangeModModule {}
