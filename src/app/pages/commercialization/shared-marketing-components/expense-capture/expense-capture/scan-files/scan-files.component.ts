import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, of } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';

@Component({
  selector: 'app-scan-files',
  templateUrl: './scan-files.component.html',
  styleUrls: ['./scan-files.component.css'],
})
export class ScanFilesComponent extends BasePage implements OnInit {
  form: FormGroup;
  delUser: number;
  subDelUser: number;
  departmentUser: number;
  userData: any;
  user: any;
  constructor(
    private serviceDocuments: DocumentsService,
    private serviceNotification: NotificationService,
    private dataService: ExpenseCaptureDataService,
    private serviceUser: UsersService,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.form = this.fb.group({
      folioUniversal: [null, [Validators.required]],
    });
  }

  //DATA DE USUARIO
  getDataUser() {
    this.user = this.authService.decodeToken();
    console.log(this.user);
    const routeUser = `?filter.name=$eq:${this.user.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      if (res && res.data && res.data.length > 0) {
        const resJson = JSON.parse(JSON.stringify(res.data[0]));
        this.userData = resJson;
        this.delUser = resJson.usuario.delegationNumber;
        this.subDelUser = resJson.usuario.subdelegationNumber;
        this.departmentUser = resJson.usuario.departamentNumber;
      }
    });
  }

  ngOnInit() {
    this.getDataUser();
    this.dataService.updateFolio.subscribe({
      next: response => {
        const filterParams = new FilterParams();
        filterParams.addFilter('goodNumber', this.expenseNumber);
        filterParams.addFilter(
          'associateUniversalFolio',
          SearchFilter.NULL,
          SearchFilter.NULL
        );
        this.serviceDocuments.getAll(filterParams.getParams()).subscribe({
          next: response => {
            if (response && response.data) {
              console.log(response);
              this.dataService.FOLIO_UNIVERSAL = response.data[0].id;
              this.folioUniversal.setValue(response.data[0].id);
            }
          },
        });
      },
    });
  }

  get dataComer() {
    return this.dataService.data;
  }

  get expenseNumber() {
    return this.dataComer.expenseNumber;
  }

  get conceptNumber() {
    return this.dataComer.conceptNumber;
  }

  get eventNumber() {
    return this.dataComer.eventNumber;
  }

  get folioUniversal() {
    return this.form.get('folioUniversal');
  }

  async generateFolio() {
    if (this.folioUniversal && this.folioUniversal.value) {
      this.alert('error', 'Generar Folio', 'El gasto ya cuenta con un folio');
      return;
    }
    let FOLIO_ASOC: any;
    const DESCR =
      'ID GASTO: ' +
      this.expenseNumber +
      ' CANCELACION DE VENTA POR SOLICITUD DE AUTORIDAD';
    this.dataService.dataCompositionExpenses
      .filter(row => row.expendientNumber !== null)
      .forEach(async (x, index) => {
        console.log(x);
        const route = `notification?filter.wheelNumber=$not:$null&filter.expedientNumber=$eq:${x.expendientNumber}&sortBy=wheelNumber:DESC`;
        const notifications = await firstValueFrom(
          this.serviceNotification
            .getAllFilter(route)
            .pipe(catchError(x => of(null)))
        );
        if (notifications) {
          const DATO4 = notifications.data[0]['wheelNumber'];

          if (this.userData) {
            const modelDocument: IDocuments = {
              id: this.userData.data[0]['id'],
              natureDocument: 'ORIGINAL',
              descriptionDocument: DESCR,
              significantDate: format(new Date(), 'MM/yyyy'),
              scanStatus: index === 0 ? 'SOLICITADO' : 'ESCANEADO',
              fileStatus: '',
              userRequestsScan: this.user.preferred_username,
              scanRequestDate: new Date(),
              userRegistersScan: this.user.preferred_username,
              dateRegistrationScan: undefined,
              userReceivesFile: '',
              dateReceivesFile: undefined,
              keyTypeDocument: 'ENTRE',
              keySeparator: '60',
              numberProceedings: x.expendientNumber,
              sheets: '',
              numberDelegationRequested: this.userData.usuario.delegationNumber,
              numberSubdelegationRequests:
                this.userData.usuario.subdelegationNumber,
              numberDepartmentRequest: this.userData.usuario.departamentNumber,
              registrationNumber: 0,
              flyerNumber: DATO4,
              userSend: '',
              areaSends: '',
              sendDate: undefined,
              sendFilekey: '',
              userResponsibleFile: '',
              mediumId: '',
              associateUniversalFolio: index > 0 ? FOLIO_ASOC : 0,
              dateRegistrationScanningHc: undefined,
              dateRequestScanningHc: undefined,
              goodNumber: this.expenseNumber,
            };
            let createDocument = await firstValueFrom(
              this.serviceDocuments.create(modelDocument).pipe(
                catchError(x => {
                  this.alert('error', 'Generar Folio', x);
                  return of(null);
                })
              )
            );
            if (!createDocument) {
              return;
            }
            if (index === 0) {
              FOLIO_ASOC = createDocument.id;
            }
          }
        }
      });
  }

  goToScan() {
    // localStorage.setItem('numberExpedient', this.noExpedient.toString());

    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: {
        origin: 'FCOMER084',
        folio: this.folioUniversal.value,
      },
    });
  }

  scan() {
    if (this.conceptNumber && this.eventNumber) {
      if (this.folioUniversal && this.folioUniversal.value) {
        this.alertQuestion(
          'question',
          'Se abrirá la pantalla de escaneo para el folio de escaneo del acta abierta.',
          '¿Deseas continuar?'
        ).then(x => {
          if (x.isConfirmed) {
            this.goToScan();
          }
        });
      } else {
        this.alert('error', 'No existe folio de escaneo a escanear.', '');
      }
    } else {
      this.alert(
        'error',
        'No se puede escanear para un gasto que no esta guardado',
        ''
      );
    }
  }

  downloadReport(reportName: string, params: any) {
    // this.loadingText = 'Generando reporte ...';
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  //IMPRIMIR
  printScanFile() {
    if (this.folioUniversal.value != null) {
      const params = {
        pn_folio: this.folioUniversal.value,
      };
      this.downloadReport('RGERGENSOLICDIGIT', params);
    } else {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
    }
  }

  //CONSULTA DE IMAGENES
  seeImages() {
    if (this.folioUniversal.value != null) {
      this.serviceDocuments
        .getByFolio(this.folioUniversal.value)
        .subscribe(res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          const idMedium = data.data[0]['mediumId'];

          if (scanStatus === 'ESCANEADO') {
            this.goToScan();
          } else {
            this.alert(
              'warning',
              'No existe documentación para este folio',
              ''
            );
          }
        });
    } else {
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
    }
  }
}
