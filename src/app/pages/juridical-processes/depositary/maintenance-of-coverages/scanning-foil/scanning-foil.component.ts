import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { RELATED_FOLIO_COLUMNS } from '../../legal-opinions-office/legal-opinions-office/columns';
import { ModalScanningFoilTableComponent } from '../../legal-opinions-office/modal-scanning-foil/modal-scanning-foil.component';
import { MaintenanceOfCoveragesService } from '../maintenace-of-coverages-services/maintenance-of-coverages.service';

@Component({
  selector: 'app-scanning-foil',
  templateUrl: './scanning-foil.component.html',
  styles: [``],
})
export class ScanningFoilComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() notifications?: any;
  @Input() screenKey: string = '';
  @Input() screenKey2: string = '';
  @Input() screenKey3: string = '';
  @Input() folio: string = null;
  @Input() documents: IDocuments = null;
  @Input() processNumber: number = null;

  //Reactive Forms
  form: FormGroup;
  user: any;
  dataUserLogged: any;

  documentsServices = inject(DocumentsService);
  authServeice = inject(AuthService);
  msUserService = inject(UsersService);
  siabService = inject(SiabService);
  sanitizer = inject(DomSanitizer);
  modalService = inject(BsModalService);
  router = inject(Router);
  maintenanceOfCoveragesHelperService = inject(MaintenanceOfCoveragesService);
  documentsService = inject(DocumentsService);

  get scanningFoli() {
    return this.form.get('scanningFoli');
  }

  constructor(private fb: FormBuilder) {
    super();
    this.user = this.authServeice.decodeToken();
    console.log(this.user);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.folio) {
      this.form.get('scanningFoli').setValue(this.folio);
    }
  }

  ngOnInit(): void {
    this.buildForm();

    if (this.user.preferred_username) {
      this.getUserDataLogged(this.user.preferred_username);
    }
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      scanningFoli: [null, [Validators.required]],
    });
  }

  async createScannerFoil() {
    if (this.notifications.expedientNumber) {
      const response = await this.alertQuestion(
        'question',
        'Aviso',
        'Se generará un nuevo folio de Escaneo para el Dictamen, ¿Desea continuar?'
      );

      if (!response.isConfirmed) {
        return;
      }

      const document = {
        numberProceedings: this.notifications.expedientNumber,
        keySeparator: '60',
        keyTypeDocument: 'AMPA',
        natureDocument: 'ORIGINAL',
        descriptionDocument: `AMPARO EXPEDIENTE ${this.notifications.expedientNumber}`, // Clave de Oficio Armada
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
        flyerNumber: this.notifications.wheelNumber,
      };

      const folio: any = await this.createDocument(document);
      this.form.controls['scanningFoli'].setValue(folio.id);
      this.maintenanceOfCoveragesHelperService.setFolioUniversal(folio.id);
      this.generateScanRequestReport();
    } else {
      this.onLoadToast(
        'error',
        'Error',
        'El número de expediente no puede estar vacia'
      );
    }
  }

  createDocument(document: any) {
    return new Promise((resolve, reject) => {
      this.documentsServices
        .create(document)
        .pipe(
          catchError(error => {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrió un error al generar el documento'
            );
            return throwError(() => error);
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  getUserDataLogged(userId: string) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'user',
      userId == 'SIGEBIADMON' ? userId.toLocaleLowerCase() : userId
    );
    this.msUserService
      .getInfoUserLogued(params.getParams())
      .pipe(map(x => x.data[0]))
      .subscribe({
        next: (res: any) => {
          console.log('access_x_aresas', res);
          this.dataUserLogged = res;
        },
        error: error => {
          console.log(error);
          this.alertInfo(
            'warning',
            'Error al obtener los datos del Usuario de la sesión actual',
            error.error.message
          );
        },
      });
  }

  generateScanRequestReport() {
    const pn_folio = this.form.get('scanningFoli').value;
    return this.siabService
      .fetchReport('RGERGENSOLICDIGIT', { pn_folio })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
        /*tap(response => {})
         */
      )
      .subscribe({
        next: response => {
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
        },
      });
  }

  openScannerPage() {
    if (
      this.notifications.expedientNumber &&
      this.form.controls['scanningFoli'].value
    ) {
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
              origin: 'FADMAMPAROS', //this.screenKey,
              wheelNumber: this.notifications.wheelNumber,
              expedientNumber: this.notifications.expedientNumber,
              folio: this.form.get('scanningFoli').value,
              processNumber: this.processNumber,
            },
          });
        }
      });
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

  showScannerFoil() {
    const folio = this.form.get('scanningFoli').value;
    if (!folio) {
      this.alertInfo('info', 'No tiene folio de escaneo para visualizar.', '');
      return;
    }

    this.insertListImg();
  }

  insertListImg() {
    if (
      this.notifications.expedientNumber != this.documents.registrationNumber
    ) {
    }
    this.getDocumentsByFlyer(this.notifications.wheelNumber);
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = 'Folios relacionados al Volante';
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    // const body = {
    //   proceedingsNum: this.dictationData.expedientNumber,
    //   flierNum: this.dictationData.wheelNumber,
    // };
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        proceedingsNumber: this.notifications.expedientNumber,
        wheelNumber: this.notifications.wheelNumber,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      ModalScanningFoilTableComponent<IDocuments>,
      config
    );
  }

  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
    /*if (document.id != this.dictationData.folioUniversal) {
      folio = this.dictationData.folioUniversal;
    }*/
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }
}
