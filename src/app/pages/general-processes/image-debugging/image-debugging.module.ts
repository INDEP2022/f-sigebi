import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageDebuggingRoutingModule } from './image-debugging-routing.module';
import { ImageDebuggingComponent } from './image-debugging/image-debugging.component';

@NgModule({
  declarations: [ImageDebuggingComponent],
  imports: [
    CommonModule,
    ImageDebuggingRoutingModule,
    SharedModule,
    AccordionModule,
  ],
})
export class ImageDebuggingModule {}
