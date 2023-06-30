import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IAppointmentDepositary,
  IDepositaryAppointments_custom,
} from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-scanning-foil-appointment',
  templateUrl: './scanning-foil.component.html',
  styles: [``],
})
export class ScanningFoilAppointmentComponent
  extends BasePage
  implements OnInit
{
  //Reactive Forms
  @Input() formScan: FormGroup;
  @Input() screenKey: string = '';
  @Input() goodId: number = null;
  // @Input() depositaryAppointment: IAppointmentDepositary;
  @Input() depositaryAppointment: IDepositaryAppointments_custom;
  @Input() dictationData: IDictation;
  @Input() dataUserLogged: any;
  @Input() paramsScreen: any;
  @Input() disabled: boolean = false;

  @Output() scanRequestEmitter = new EventEmitter<boolean>();
  @Output() showScanningPageEmitter = new EventEmitter<boolean>();
  @Output() viewPicturesEmitter = new EventEmitter<boolean>();
  @Output() messageDigitalizationEmitter = new EventEmitter<boolean>();

  get scanningFoli() {
    return this.formScan.get('scanningFoli');
  }
  get returnFoli() {
    return this.formScan.get('returnFoli');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private documentsService: DocumentsService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private msDepositaryService: MsDepositaryService,
    private msNotificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.buildForm();
    console.log(this.formScan.value);
  }

  private buildForm() {
    this.formScan = this.fb.group({
      scanningFoli: [
        { value: '', disabled: false },
        [
          [
            Validators.required,
            Validators.pattern(NUM_POSITIVE),
            Validators.maxLength(11),
          ],
        ],
      ],
      returnFoli: [
        { value: '', disabled: false },
        [
          [
            Validators.required,
            Validators.pattern(NUM_POSITIVE),
            Validators.maxLength(11),
          ],
        ],
      ],
    });
  }

  async createScannerFoil() {
    this.scanRequestEmitter.emit(true);
  }

  showScannerFoil() {
    this.viewPicturesEmitter.emit(true);
  }

  openScannerPage() {
    this.showScanningPageEmitter.emit(true);
  }

  showMessageDigitalization() {
    this.messageDigitalizationEmitter.emit(true);
  }

  createDocument(document: IDocuments) {
    return this.documentsService.create(document).pipe(
      tap(_document => {
        // END PROCESS
      }),
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al generar el documento'
        );
        return throwError(() => error);
      })
    );
  }

  generateScanRequestReport() {
    const pn_folio = this.formScan.get('scanningFoli').value;
    return this.siabService.fetchReport('RGERGENSOLICDIGIT', { pn_folio }).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
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
    );
  }

  updateDictation(body: Partial<IAppointmentDepositary>) {
    return this.msDepositaryService.update(body).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al actualizar el Folio Universal'
        );
        return throwError(() => error);
      })
    );
  }

  async replicate() {
    // if (!this.officeDictationData && !this.dictationData) {
    //   return;
    // }
    if (this.goodId) {
      if (this.formScan.get('scanningFoli').value) {
        // Replicate function
        const response = await this.alertQuestion(
          'question',
          'Aviso',
          'Se generará un nuevo folio de escaneo y se le copiarán las imágenes del folio de escaneo actual. ¿Deseas continuar?'
        );

        if (!response.isConfirmed) {
          return;
        }

        // if (!this.dictationData.wheelNumber) {
        //   this.onLoadToast(
        //     'error',
        //     'Error',
        //     'El trámite no tiene un número de volante'
        //   );
        //   return;
        // }

        this.getDocumentsCount().subscribe(count => {
          console.log('COUNT ', count);

          if (count == 0) {
            this.alert(
              'warning',
              'Folio de escaneo inválido para replicar',
              ''
            );
          } else {
            if (this.depositaryAppointment.good.fileNumber) {
              // Obtener el volante a partir del expediente del bien
              this.msNotificationService
                .getCFlyer(Number(this.depositaryAppointment.good.fileNumber))
                .subscribe({
                  next: data => {
                    console.log('DATA ', data.data);
                    if (this.depositaryAppointment.personNumber.id == null) {
                      this.alertInfo(
                        'warning',
                        'Se requiere una persona del Catálogo de Personas',
                        ''
                      );
                    } else {
                      if (this.depositaryAppointment.amountvat == null) {
                        this.depositaryAppointment.amountvat = 0;
                      }
                      if (this.depositaryAppointment.vat == null) {
                        this.depositaryAppointment.vat = 0;
                      }
                      // INSERTAR REGISTRO PARA EL DOCUMENTO
                      this.saveNewUniversalFolio_Replicate(data.data[0].min);
                    }
                  },
                  error: error => {
                    this.alertInfo(
                      'warning',
                      'Ocurrió un error al obtener el Volante',
                      ''
                    );
                  },
                });
            } else {
              this.alertInfo(
                'warning',
                'El Bien debe tener un expediente para poder replicar',
                ''
              );
            }
          }
        });
      } else {
        this.alertInfo(
          'warning',
          'Especifique el folio de escaneo a replicar',
          ''
        );
      }
    } else {
      this.alertInfo(
        'warning',
        'No se puede replicar el folio de escaneo si no existe un bien',
        ''
      );
    }
  }

  saveNewUniversalFolio_Replicate(wheelNumber: number) {
    const document = {
      numberProceedings: Number(this.depositaryAppointment.good.fileNumber),
      keySeparator: '60',
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `NO BIEN ${Number(this.goodId)}`, // NUMERO DE BIEN
      significantDate: format(new Date(), 'MM-yyyy'),
      scanStatus: 'ESCANEADO',
      userRequestsScan:
        this.dataUserLogged.user == 'SIGEBIADMON'
          ? this.dataUserLogged.user.toLocaleLowerCase()
          : this.dataUserLogged.user,
      scanRequestDate: new Date(),
      numberDelegationRequested: this.dataUserLogged.delegationNumber,
      numberSubdelegationRequests: this.dataUserLogged.subdelegationNumber,
      numberDepartmentRequest: this.dataUserLogged.departamentNumber,
      associateUniversalFolio: this.formScan.get('scanningFoli').value,
      flyerNumber: wheelNumber,
    };
    console.log('Documento a crear para el folio asociado', document);
    this.createDocument(document)
      .pipe(
        tap(_document => {
          this.onLoadToast(
            'success',
            'Se creó correctamente el nuevo Folio Universal: ' + _document.id,
            ''
          );
          const folio = _document.id;
          this.formScan.get('scanningFoli').setValue(folio);
          this.formScan.get('scanningFoli').updateValueAndValidity();
          this.alert('success', 'El folio universal generado es: ' + folio, '');
        }),
        switchMap(_document => {
          this.depositaryAppointment.InvoiceUniversal = _document.id.toString();
          let body: any = {
            appointmentNumber: this.depositaryAppointment.numberAppointment,
            amountIVA: this.depositaryAppointment.amountvat,
            personNumber: this.depositaryAppointment.personNumber.id,
            iva: this.depositaryAppointment.vat,
            universalFolio: Number(_document.id),
            folioReturn: this.depositaryAppointment.InvoiceReturn
              ? Number(this.depositaryAppointment.InvoiceReturn)
              : null,
          };
          this.formScan.get('scanningFoli').setValue(_document.id);
          return this.updateDictation(body).pipe(map(() => _document));
        }),
        switchMap(_document => this.generateScanRequestReport())
      )
      .subscribe();
  }

  getDocumentsCount() {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter(
      'associateUniversalFolio',
      SearchFilter.NULL,
      SearchFilter.NULL
    );
    params.addFilter('id', this.formScan.get('scanningFoli').value);
    // if (this.depositaryAppointment.revocation == 'N') {
    //   params.addFilter('id', this.formScan.get('scanningFoli').value);
    // } else {
    //   params.addFilter('id', this.formScan.get('returnFoli').value);
    // }
    console.log(params);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          return of({ count: 0 });
        }
        this.onLoadToast(
          'error',
          'Ocurrió un error al validar el Folio ingresado',
          error.error.message
        );
        return throwError(() => error);
      }),
      map(response => response.count)
    );
  }
}
