import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ImageDebuggingRoutingModule } from './image-debugging-routing.module';
import { ImageDebuggingComponent } from './image-debugging/image-debugging.component';

@NgModule({
  declarations: [ImageDebuggingComponent],
  imports: [CommonModule, ImageDebuggingRoutingModule, SharedModule],
})
export class ImageDebuggingModule {}
