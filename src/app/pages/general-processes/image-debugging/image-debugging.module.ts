import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageDebuggingModalComponent } from './image-debugging-modal/image-debugging-modal.component';
import { ImageDebuggingRoutingModule } from './image-debugging-routing.module';
import { ImageDebuggingComponent } from './image-debugging/image-debugging.component';

@NgModule({
  declarations: [ImageDebuggingComponent, ImageDebuggingModalComponent],
  imports: [
    CommonModule,
    ImageDebuggingRoutingModule,
    SharedModule,
    AccordionModule,
    TabsModule,
  ],
})
export class ImageDebuggingModule {}
