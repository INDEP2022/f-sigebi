import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { MaintenanceOfCoveragesService } from '../maintenace-of-coverages-services/maintenance-of-coverages.service';

@Component({
  selector: 'app-scanning-foil',
  templateUrl: './scanning-foil.component.html',
  styles: [``],
})
export class ScanningFoilComponent extends BasePage implements OnInit {
  @Input() notifications?: any;
  @Input() screenKey: string = '';
  @Input() screenKey2: string = '';
  @Input() screenKey3: string = '';
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

  get scanningFoli() {
    return this.form.get('scanningFoli');
  }

  constructor(private fb: FormBuilder) {
    super();
    this.user = this.authServeice.decodeToken();
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
      this.notifications.expedientNumber /* &&
      this.form.controls['scanningFoli'].value*/
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
              folio: 11, //this.form.get('scanningFoli').value,
            },
          });
        }
      });
    }
  }
}
