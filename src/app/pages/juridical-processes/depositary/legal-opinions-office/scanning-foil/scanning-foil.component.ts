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
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-scanning-foil',
  templateUrl: './scanning-foil.component.html',
  styles: [``],
})
export class ScanningFoilComponent extends BasePage implements OnInit {
  //Reactive Forms
  @Input() form: FormGroup;
  @Input() screenKey: string = '';
  @Input() screenKey2: string = '';
  @Input() screenKey3: string = '';
  @Input() officeDictationData: IOfficialDictation;
  @Input() dictationData: IDictation;
  @Input() dataUserLogged: any;
  @Input() paramsScreen: any;
  @Input() disabled: boolean = false;

  @Output() viewPicturesEmitter = new EventEmitter<boolean>();
  @Output() uploadPdfEmitter = new EventEmitter<boolean>();

  get scanningFoli() {
    return this.form.get('scanningFoli');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private documentsService: DocumentsService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private msDictationService: DictationService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log(this.form.value);
    // this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      scanningFoli: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern(NUM_POSITIVE),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  async createScannerFoil() {
    if (!this.officeDictationData && !this.dictationData) {
      return;
    }
    if (
      this.officeDictationData.statusOf == 'ENVIADO' &&
      this.dictationData.passOfficeArmy
    ) {
      if (!this.form.get('scanningFoli').value) {
        // Llamar a crear folio universal
        await this.confirmScanRequest();
      } else {
        this.alertInfo('info', 'El Dictamen ya tiene Folio de Escaneo', '');
      }
    } else {
      this.alertInfo(
        'warning',
        'No se puede escanear para un Dictamen que esté abierto',
        ''
      );
    }
  }

  showScannerFoil() {
    if (!this.officeDictationData && !this.dictationData) {
      return;
    }
    if (this.form.get('scanningFoli').value) {
      // Insertar imagenes
      this.viewPicturesEmitter.emit(true);
    } else {
      this.alertInfo(
        'warning',
        'No tiene folio de Escaneo para visualizar',
        ''
      );
    }
  }

  openScannerPage() {
    if (!this.officeDictationData || !this.dictationData) {
      return;
    }
    if (
      this.officeDictationData.statusOf == 'ENVIADO' &&
      this.dictationData.passOfficeArmy
    ) {
      if (this.form.get('scanningFoli').value) {
        this.alertQuestion(
          'info',
          'Se abrirá la pantalla de escaneo para el folio de Escaneo del Dictamen. ¿Deseas continuar?',
          '',
          'Aceptar',
          'Cancelar'
        ).then(res => {
          console.log(res);
          if (res.isConfirmed) {
            this.router.navigate(['/pages/general-processes/scan-documents'], {
              queryParams: {
                origin: this.screenKey,
                origin2: this.screenKey2,
                origin3: this.screenKey3,
                folio: this.form.get('scanningFoli').value,
                ...this.paramsScreen,
              },
            });
          }
        });
      } else {
        this.alertInfo(
          'warning',
          'No tiene Folio de Escaneo para continuar a la pantalla de Escaneo',
          ''
        );
      }
    } else {
      this.alertInfo(
        'warning',
        'No se puede Escanear para un Dictamen que esté abierto',
        ''
      );
    }
  }

  showMessageDigitalization() {
    if (this.form.get('scanningFoli').value) {
      this.alertInfo(
        'success',
        'El folio universal generado es: "' +
          this.form.get('scanningFoli').value +
          '"',
        ''
      );
    } else {
      this.alertInfo('warning', 'No tiene Folio de Escaneo para Imprimir', '');
    }
  }

  async confirmScanRequest() {
    const response = await this.alertQuestion(
      'question',
      'Aviso',
      'Se generará un nuevo folio de Escaneo para el Dictamen, ¿Desea continuar?'
    );

    if (!response.isConfirmed) {
      return;
    }

    const flyerNumber = this.dictationData.wheelNumber;
    if (!flyerNumber) {
      this.alert(
        'error',
        'Error',
        'Al localizar la información de Volante: ' +
          flyerNumber +
          ' y Expediente: ' +
          this.dictationData.expedientNumber
      );
      return;
    }
    // const { numFile, keysProceedings } = this.controls;
    const document = {
      numberProceedings: this.dictationData.expedientNumber,
      keySeparator: '60',
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `DICTAMEN ${this.dictationData.passOfficeArmy}`, // Clave de Oficio Armada
      significantDate: format(new Date(), 'MM-yyyy'),
      scanStatus: 'SOLICITADO',
      userRequestsScan:
        this.dataUserLogged.user == 'SIGEBIADMON'
          ? this.dataUserLogged.user.toLocaleLowerCase()
          : this.dataUserLogged.user,
      scanRequestDate: new Date(),
      numberDelegationRequested: this.dataUserLogged.delegationNumber,
      numberSubdelegationRequests: this.dataUserLogged.subdelegationNumber,
      numberDepartmentRequest: this.dataUserLogged.departamentNumber,
      flyerNumber: this.dictationData.wheelNumber,
    };

    this.createDocument(document)
      .pipe(
        tap(_document => {
          this.form.get('scanningFoli').setValue(_document.id);
        }),
        switchMap(_document => {
          this.dictationData.folioUniversal =
            this.form.get('scanningFoli').value;
          return this.updateDictation(this.dictationData).pipe(
            map(() => _document)
          );
        }),
        switchMap(_document => this.generateScanRequestReport())
      )
      .subscribe();
  }

  addPdf() {}

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
    const pn_folio = this.form.get('scanningFoli').value;
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

  updateDictation(dictation: Partial<IDictation>) {
    return this.msDictationService.update(dictation).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al actualizar la Dictaminación'
        );
        return throwError(() => error);
      })
    );
  }

  async replicate() {
    if (!this.officeDictationData && !this.dictationData) {
      return;
    }
    if (
      this.officeDictationData.statusOf == 'ENVIADO' &&
      this.dictationData.passOfficeArmy
    ) {
      if (this.form.get('scanningFoli').value) {
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
          if (count == 0) {
            this.alert(
              'warning',
              'Folio de escaneo inválido para replicar',
              ''
            );
          } else {
            // INSERTAR REGISTRO PARA EL DOCUMENTO
            this.saveNewUniversalFolio_Replicate();
          }
        });
      } else {
        this.alertInfo(
          'warning',
          'Especifique el folio de escaneo a replicar',
          ''
        );
        return;
      }
    } else {
      this.alertInfo(
        'warning',
        'No se puede replicar el folio de escaneo en un dictamen abierto',
        ''
      );
      return;
    }
  }

  saveNewUniversalFolio_Replicate() {
    const document = {
      numberProceedings: this.dictationData.expedientNumber,
      keySeparator: '60',
      keyTypeDocument: 'ENTRE',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `DICTAMEN ${this.dictationData.passOfficeArmy}`, // Clave de Oficio Armada
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
      associateUniversalFolio: this.form.get('scanningFoli').value,
      flyerNumber: this.dictationData.wheelNumber,
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
          this.form.get('scanningFoli').setValue(folio);
          this.form.get('scanningFoli').updateValueAndValidity();
          this.alert('success', 'El folio universal generado es: ' + folio, '');
          // this.updateDocumentsByFolio(
          //   folio,
          //   document.associateUniversalFolio
          // ).subscribe();
        }),
        switchMap(_document => {
          this.dictationData.folioUniversal = Number(_document.id);
          // this.form.get('scanningFoli').value;
          return this.updateDictation(this.dictationData).pipe(
            map(() => _document)
          );
        })
        // switchMap(_document => this.generateScanRequestReport())
      )
      .subscribe();
  }

  // updateDocumentsByFolio(folioLNU: string | number, folioLST: string) {
  //   return this.documentsService.updateByFolio({ folioLNU, folioLST }).pipe(
  //     catchError(error => {
  //       this.alert(
  //         'error',
  //         'Ocurrio un error al replicar el folio',
  //         error.error.message
  //       );
  //       return throwError(() => error);
  //     }),
  //     tap(() => {
  //       this.alert('success', 'Folio replicado correctamente ' + folioLNU, '');
  //       this.form.get('scanningFoli').setValue(folioLNU);
  //     })
  //   );
  // }

  getDocumentsCount() {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter(
      'associateUniversalFolio',
      SearchFilter.NULL,
      SearchFilter.NULL
    );
    params.addFilter('id', this.form.get('scanningFoli').value);
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

  getDocumentsByFlyers(flyers: string) {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter('flyerNumber', SearchFilter.NULL, SearchFilter.NOT);
    params.addFilter('numberProceedings', this.dictationData.expedientNumber);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          this.alert(
            'error',
            'Error',
            'No existe un folio universal escaneado para replicar'
          );
        } else {
          this.alert('error', 'Error', 'Ocurrio un error al replicar el folio');
        }
        return throwError(() => error);
      })
    );
  }
}
