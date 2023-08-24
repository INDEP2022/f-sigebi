import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { FilePhotoService } from 'src/app/core/services/ms-ldocuments/file-photo.service';
import { PublicationPhotographsService } from 'src/app/core/services/ms-parametercomer/publication-photographs.service';
import { BasePage } from 'src/app/core/shared';

const LOADING_GIF = 'assets/images/loader-button.gif  ';
const NO_IMAGE_FOUND = 'assets/images/documents-icons/not-found.jpg';
@Component({
  selector: 'photo-galery-item',
  templateUrl: './photo-galery-item.component.html',
  styles: [
    `
      .info {
        max-height: 200px;
        min-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .labe-circle-red {
        border-radius: 4px;
        background-color: rgba(157, 36, 73, 0.6);
      }
      .labe-circle-turq {
        border-radius: 4px;
        background-color: rgb(23, 162, 184, 0.53);
      }
      .labe-circle-green {
        border-radius: 4px;
        background-color: rgb(30, 126, 52, 0.66);
      }
      .labe-circle-lime {
        border-radius: 4px;
        background-color: rgb(34, 174, 66, 0.66);
      }
      .labe-circle-purple {
        border-radius: 4px;
        background-color: rgb(139, 8, 176, 0.55);
      }
      .labe-circle-gray {
        border-radius: 4px;
        background-color: rgb(120, 130, 134, 0.55);
      }
      .labe-circle-silver {
        border-radius: 4px;
        background-color: rgb(120, 130, 134, 0.55);
      }
      .labe-circle-blue {
        border-radius: 4px;
        background-color: rgb(50, 164, 216, 0.55);
      }
    `,
  ],
})
export class PhotoGaleryItemComponent extends BasePage implements OnInit {
  @Input() good: ITrackedGood = null;
  imgSrc: string = null;
  constructor(
    private filePhotoService: FilePhotoService,
    private photoService: PublicationPhotographsService,
    private jasperServ: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
  }

  ngOnInit(): void {
    this.imgSrc = LOADING_GIF;
    this.filePhotoService.getAll(this.good.goodNumber).subscribe({
      next: res => {
        console.log(res);
        if (!res.length) {
          this.imgSrc = NO_IMAGE_FOUND;
          return;
        }
        const last = res.at(-1);
        const filename = last.name.split('.')[0];
        const consSplit = filename.split('F');
        const consec = consSplit.at(-1);
        console.log({ consec });

        // const consec = filename.substring(filename.length - 4);
        this.filePhotoService
          .getById(this.good.goodNumber, Number(consec))
          .subscribe({
            next: res => {
              if (!res) {
                this.imgSrc = NO_IMAGE_FOUND;
              }
              this.imgSrc = `data:image/png;base64, ${res}`;
            },
            error: () => {
              this.imgSrc = NO_IMAGE_FOUND;
            },
          });
      },
      error: error => {
        this.imgSrc = NO_IMAGE_FOUND;
      },
    });
  }

  async callReport(good: ITrackedGood) {
    if (good.goodNumber) {
      await this.insertListPhoto(Number(good.goodNumber));
      this.callReportR(Number(good.goodNumber), null);
    } else {
      this.alert('error', 'Error', 'Se requiere de un bien');
    }
  }

  async insertListPhoto(goodNumber: number) {
    return firstValueFrom(
      this.photoService
        .pubPhoto({
          pcNoGood: goodNumber,
          lNuNoGood: goodNumber,
        })
        .pipe(
          catchError(err => of(false)),
          map(res => true)
        )
    );
  }

  async callReportR(lnu_good: number, lnu_identificador: number) {
    this.jasperServ
      .fetchReport('FICHATECNICA', {
        P_NO_BIEN: lnu_good,
        P_IDENTIFICADOR: lnu_identificador ?? '',
      })
      .pipe(
        tap(response => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        })
      )
      .subscribe();
  }
}
