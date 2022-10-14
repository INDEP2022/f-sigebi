import {
  Component,
  HostListener,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerConfig } from './image-viewer.config';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PreviewFullscreenDirective } from './preview-fullscreen.directive';

const DEFAULT_CONFIG: ImageViewerConfig = {
  btnClass: 'default',
  zoomFactor: 0.1,
  containerBackgroundColor: '#ccc',
  wheelZoom: false,
  allowFullscreen: false,
  allowKeyboardNavigation: true,
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: true,
    rotateCounterClockwise: true,
    next: false,
    prev: false,
    close: true,
    fullscreen: false,
  },
  btnIcons: {
    zoomIn: 'bx bx-zoom-in',
    zoomOut: 'bx bx-zoom-out',
    rotateClockwise: 'bx bx-rotate-right',
    rotateCounterClockwise: 'bx bx-rotate-left',
    next: 'bx bx-chevron-right',
    prev: 'bx bx-chevron-left',
    fullscreen: 'bx bx-fullscreen',
    close: 'bx bx-x',
  },
};

@Component({
  selector: 'app-preview-documents',
  standalone: true,
  imports: [PreviewFullscreenDirective, CommonModule],
  templateUrl: './preview-documents.component.html',
  styleUrls: ['./preview-documents.component.scss'],
})
export class PreviewDocumentsComponent implements OnInit {
  public documento: any;
  private zoom?: number = 0;
  private translateX?: number = 0;
  private translateY?: number = 0;
  public src: string[];
  public index = 0;
  public config: ImageViewerConfig;
  private rotation: number = 0;
  // @Output() indexChange: EventEmitter<number> = new EventEmitter();
  // @Output() configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();
  // @Output() customEvent: EventEmitter<CustomEvent> = new EventEmitter();
  // @Output() rotationEvent: EventEmitter<number> = new EventEmitter();
  // @Output() zoomEvent: EventEmitter<number> = new EventEmitter();
  // @Output() prevXEvent: EventEmitter<number> = new EventEmitter();
  // @Output() prevYEvent: EventEmitter<number> = new EventEmitter();
  public style = {
    transform: '',
    msTransform: '',
    oTransform: '',
    webkitTransform: '',
  };
  public fullscreen = false;
  public loading = true;
  private scale = 1;
  private prevX: number;
  private prevY: number;
  private hovered = false;
  private rotate: boolean = true;
  constructor(
    @Optional() @Inject('config') public moduleConfig: ImageViewerConfig,
    public modalRef: BsModalRef
  ) {}

  ngOnInit() {
    const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
    this.config = this.mergeConfig(merged, this.config);
    this.triggerConfigBinding();
    this.zoom > 0 ? this.zoomInit(this.zoom) : null;
    // this.zoomInit(1.4);
  }

  @HostListener('window:keyup.ArrowRight', ['$event'])
  public nextImage(event: any) {
    if (this.canNavigate(event) && this.index < this.src.length - 1) {
      this.loading = true;
      this.index++;
      this.triggerIndexBinding();
      this.reset();
    }
  }

  @HostListener('window:keyup.ArrowLeft', ['$event'])
  public prevImage(event: any) {
    if (this.canNavigate(event) && this.index > 0) {
      this.loading = true;
      this.index--;
      this.triggerIndexBinding();
      this.reset();
    }
  }
  public zoomInit(zoom: number) {
    if (this.config != undefined) {
      this.scale *= zoom + this.config.zoomFactor;
      this.updateStyle();
    }
  }
  public zoomIn() {
    this.scale *= 1 + this.config.zoomFactor;
    this.updateFirstStyle();
  }

  public zoomOut() {
    if (this.scale > this.config.zoomFactor) {
      this.scale /= 1 + this.config.zoomFactor;
    }
    this.updateFirstStyle();
  }

  public scrollZoom(evt: any): boolean {
    if (this.config.wheelZoom) {
      evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
      return false;
    }
    return true;
  }

  public rotateClockwise() {
    this.rotation += 90;
    this.rotate = true;
    this.updateStyle();
  }

  public rotateCounterClockwise() {
    this.rotation -= 90;
    this.rotate = true;
    this.updateStyle();
  }

  public onLoad() {
    this.loading = false;
  }

  public onLoadStart() {
    this.loading = true;
  }

  public onDragOver(evt: any) {
    this.translateX += evt.clientX - this.prevX;
    this.translateY += evt.clientY - this.prevY;
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
    this.updateStyle();
  }

  public onDragStart(evt: any) {
    if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
      evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
    }
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
  }

  public toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    if (!this.fullscreen) {
      this.reset();
    }
  }

  public triggerIndexBinding() {}

  public triggerConfigBinding() {}

  public fireCustomEvent(name: any, imageIndex: any) {}

  public reset() {
    this.scale = 1;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateStyle();
  }

  @HostListener('mouseover')
  private onMouseOver() {
    this.hovered = true;
  }

  @HostListener('mouseleave')
  private onMouseLeave() {
    this.hovered = false;
  }

  private canNavigate(event: any) {
    return (
      event == null || (this.config.allowKeyboardNavigation && this.hovered)
    );
  }

  private updateStyle() {
    // this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
    this.rotate = false;
  }
  private updateFirstStyle() {
    this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
    this.zoom = this.scale;
  }

  private mergeConfig(
    defaultValues: ImageViewerConfig,
    overrideValues: ImageViewerConfig
  ): ImageViewerConfig {
    let result: ImageViewerConfig = { ...defaultValues };
    if (overrideValues) {
      result = { ...defaultValues, ...overrideValues };

      if (overrideValues.btnIcons) {
        result.btnIcons = {
          ...defaultValues.btnIcons,
          ...overrideValues.btnIcons,
        };
      }
    }
    return result;
  }
}
