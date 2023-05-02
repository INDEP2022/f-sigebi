import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';
import { exit, isEnabled, request } from 'screenfull';

@Directive({
  selector: '[appPreviewFullscreen]',
  standalone: true,
})
export class PreviewFullscreenDirective {
  @Input('appPreviewFullscreen')
  isFullscreen: boolean;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['isFullscreen']?.isFirstChange()) {
      if (this.isFullscreen && isEnabled) {
        request(this.el?.nativeElement);
      } else if (isEnabled) {
        try {
          exit();
        } catch (error) {}
      }
    }
  }
}
