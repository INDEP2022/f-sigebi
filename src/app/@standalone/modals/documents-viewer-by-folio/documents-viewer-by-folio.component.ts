import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { catchError, map, throwError } from 'rxjs';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import { TiffViewerComponent } from '../../tiff-viewer/tiff-viewer.component';

@Component({
  selector: 'app-documents-viewer-by-folio',
  standalone: true,
  imports: [CommonModule, SharedModule, TiffViewerComponent, TooltipModule],
  templateUrl: './documents-viewer-by-folio.component.html',
  styles: [
    `
      .buttons {
        color: black;
      }
      .body {
        margin-top: -40px !important;
      }
    `,
  ],
})
export class DocumentsViewerByFolioComponent
  extends BasePage
  implements OnInit
{
  folio: number | string = null;
  images: {
    filename: string;
  }[] = [];
  index = 0;
  constructor(
    private fileBrowserService: FileBrowserService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.getFileNamesByFolio().subscribe(response => {
      this.images = response;
    });
  }

  getFileNamesByFolio() {
    return this.fileBrowserService.getFilenamesFromFolio(this.folio).pipe(
      catchError(error => {
        if (error.status < 500) {
          this.modalRef.hide();
          this.alert('warning', 'Aviso', 'No hay documentos digitalizados');
          // setTimeout(() => {
          //   this.modalRef.hide();
          // }, 0);
        }
        if (error.status >= 500) {
          this.alert(
            'error',
            'Error',
            'Ocurrió un problema al obtener los archivos'
          );
          this.modalRef.hide();
        }
        return throwError(() => error);
      }),
      map(response => response.data.map(element => element.name)),
      map(names =>
        names.map(name => {
          return {
            filename: name,
          };
        })
      )
    );
  }

  close() {
    this.modalRef.hide();
  }

  getDocumentByFolioAndName(name: string) {
    return this.fileBrowserService.getFileFromFolioAndName(this.folio, name);
  }

  getFileExtension(filename: string) {
    const arr = filename.split('.');
    return arr[arr.length - 1]?.toLowerCase();
  }
}
