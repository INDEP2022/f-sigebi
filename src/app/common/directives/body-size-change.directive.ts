import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'body',
})
export class BodySizeChangeDirective {
  constructor(private el: ElementRef) {
    console.log(this.el);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Aquí puedes realizar las acciones que desees cuando cambie el tamaño del body.
    // Para obtener el tamaño del body, usamos document.body.offsetHeight.
    const bodyHeight = document.body.offsetHeight;
    console.log(`Nuevo tamaño del body: ${bodyHeight}px`);
  }
}
