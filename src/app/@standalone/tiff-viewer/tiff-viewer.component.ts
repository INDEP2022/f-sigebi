import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { BasePage } from 'src/app/core/shared/base-page';

const Tiff = require('src/assets/js/tiff.min.js');

@Component({
  selector: 'tiff-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tiff-viewer.component.html',
  styleUrls: ['./tiff-viewer.component.scss'],
})
export class TiffViewerComponent extends BasePage implements OnInit, OnChanges {
  @Input() filename: string = '';
  @Input() folio: string | number = null;
  @ViewChild('container', { static: true })
  container: ElementRef<HTMLDivElement>;
  constructor(private fileBrowserService: FileBrowserService) {
    super();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filename']) {
      this.filenameChange();
    }
  }

  filenameChange() {
    this.container.nativeElement.innerHTML = '';
    // this.container.nativeElement.style.height = '500px';
    this.loading = true;
    this.fileBrowserService
      .getFileFromFolioAndName(this.folio, this.filename)
      .subscribe({
        next: base64 => {
          this.loading = false;
          this.base64Change(base64);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener el documento'
          );
          this.loading = false;
        },
      });
  }

  base64Change(base64: string) {
    if (base64) {
      const buffer = Buffer.from(base64, 'base64');
      const tiff = new Tiff({ buffer });
      const canvas: HTMLCanvasElement = tiff.toCanvas();
      canvas.style.width = '100%';

      this.container.nativeElement.append(canvas);
    }
  }
}
