import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IPgrFile } from 'src/app/core/models/ms-ldocument/pgr-file.model';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import { getMimeTypeFromBase64 } from 'src/app/utils/functions/get-mime-type';
import { PreviewDocumentsComponent } from '../../preview-documents/preview-documents.component';

@Component({
  selector: 'app-pgr-files',
  standalone: true,
  imports: [CommonModule, SharedModule, ModalModule, PreviewDocumentsComponent],
  templateUrl: './pgr-files.component.html',
  styleUrls: ['./pgr-files.component.scss'],
})
export class PgrFilesComponent extends BasePage implements OnInit {
  @ViewChildren('documentContents') documentContents: QueryList<
    ElementRef<HTMLDivElement>
  >;
  pgrOffice: string = null;
  isSingleClick: boolean = false;
  documentSelected: any;
  files: IPgrFile[] = [];
  params = new BehaviorSubject(new FilterParams());
  totalItems = 0;

  constructor(
    private modalRef: BsModalRef,
    private fileBrowserService: FileBrowserService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  onDocumentContentClick(documentContent: HTMLDivElement, file: any) {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.styleDocumentContent(documentContent, file);
      }
    }, 250);
  }

  viewDocument(id: string | number) {
    this.isSingleClick = false;
    const params = new FilterParams();
    params.addFilter('id', id);
    this.fileBrowserService.findPgrFile(params.getParams()).subscribe({
      next: pgrFile =>
        this.openDocumentsViewer(
          pgrFile.pgrImages,
          pgrFile.pgrDescriptionImage
        ),
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener el documento'
        );
      },
    });
  }

  openDocumentsViewer(base64: string, filename?: string) {
    const url = this.getUrlDocument(base64);
    let config = {
      initialState: {
        documento: {
          urlDoc: url,
          type: 'pdf',
        },
        filename: `${filename}.pdf`,
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getUrlDocument(base64: string) {
    let mimeType;
    mimeType = getMimeTypeFromBase64(base64, '');
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:${mimeType};base64, ${base64}`
    );
  }

  close() {
    this.modalRef.hide();
  }

  styleDocumentContent(documentContent: HTMLDivElement, file: any) {
    this.documentSelected = file;
    this.documentContents.forEach(content => {
      content.nativeElement.classList.remove('active');
    });
    documentContent.classList.add('active');
  }

  ngOnInit(): void {
    const params = this.params.getValue();
    params.addFilter('pgrJob', this.pgrOffice);
    this.params.next(params);
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        switchMap(params => this.getAllDocuments(params))
      )
      .subscribe();
  }

  getAllDocuments(params: FilterParams) {
    return this.fileBrowserService.getPgrFiles(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          this.onLoadToast('info', 'Aviso', 'No hay documentos');
        }
        return throwError(() => error);
      }),
      tap(response => {
        this.files = response.data;
        this.totalItems = response.count;
      })
    );
  }
}
