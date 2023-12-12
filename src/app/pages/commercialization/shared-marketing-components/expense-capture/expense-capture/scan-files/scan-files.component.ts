import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
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
  constructor(
    private serviceDocuments: DocumentsService,
    private serviceNotification: NotificationService,
    private dataService: ExpenseCaptureDataService,
    private serviceUser: UsersService,
    private siabService: SiabService,
    private sirsaeService: InterfacesirsaeService,
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

  get form() {
    return this.dataService.formScan;
  }

  set form(value) {
    this.dataService.formScan = value;
  }

  get user() {
    return this.dataService.user;
  }

  get userData() {
    return this.dataService.userData;
  }
  set userData(value) {
    this.dataService.userData = value;
  }

  get delUser() {
    return this.dataService.delUser;
  }
  set delUser(value) {
    this.dataService.delUser = value;
  }

  get subDelUser() {
    return this.dataService.subDelUser;
  }
  set subDelUser(value) {
    this.dataService.subDelUser = value;
  }
  get departmentUser() {
    return this.dataService.departmentUser;
  }
  set departmentUser(value) {
    this.dataService.departmentUser = value;
  }

  //DATA DE USUARIO
  getDataUser() {
    console.log(this.user);
    const routeUser = `?filter.id=$eq:${this.user.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      console.log(res);
      if (res && res.data && res.data.length > 0) {
        const resJson = JSON.parse(JSON.stringify(res.data[0]));
        this.userData = resJson;
        this.delUser = resJson.usuario.delegationNumber;
        this.subDelUser = resJson.usuario.subdelegationNumber;
        this.departmentUser = resJson.usuario.departamentNumber;
      } else {
        this.alert('error', 'No se pudo traer información del usuario', '');
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
          error: err => {
            // this.alert('warning', 'No cuenta con folio de escaneo', '');
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

  private validatePaymentCamps(event: IComerExpense) {
    if (!event.clkpv) {
      this.alert('warning', 'Validación de pagos', 'Requiere proveedor');
      return false;
    }
    if (!event.comment) {
      this.alert('warning', 'Validación de pagos', 'Requiere servicio');
      return false;
    }
    if (!event.conceptNumber) {
      this.alert(
        'warning',
        'Validación de pagos',
        'No cuenta con un concepto de pago'
      );
      return false;
    }
    if (!event.numReceipts) {
      this.alert('warning', 'No cuenta con un número de comprobantes', '');
      return false;
    }
    if (!event.comproafmandsae) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere comprobantes a nombre'
      );
      return false;
    }
    if (!event.attachedDocumentation) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere documentación anexa'
      );
      return false;
    }
    if (!event.capturedUser) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario de captura'
      );
      return false;
    }
    if (!event.authorizedUser) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario que autoriza'
      );
      return false;
    }
    if (!event.requestedUser) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario que solicita'
      );
      return false;
    }
    if (!event.formPayment) {
      this.alert('warning', 'Validación de pagos', 'Requiere Forma de Pago');
      return false;
    }
    if (!event.eventNumber) {
      this.alert('warning', 'Validación de pagos', 'Requiere número de evento');
      return false;
    }
    if (!event.lotNumber) {
      this.alert('warning', 'Validación de pagos', 'Requiere número de lote');
      return false;
    }
    return true;
  }

  get clkpv() {
    return this.form.get('clkpv');
  }

  get comment() {
    return this.form.get('comment');
  }

  get comproafmandsae() {
    return this.form.get('comproafmandsae');
  }

  get lotNumber() {
    return this.form.get('lotNumber');
  }

  private validPayments() {
    return firstValueFrom(
      this.sirsaeService
        .validPayments({
          pClkpv: this.clkpv.value,
          pComment: this.comment.value,
          pPayAfmandSae: this.comproafmandsae.value,
          pNumberVoucher: this.form.get('numReceipts').value,
          pDocumentationAnexa: this.form.get('attachedDocumentation').value,
          pUserCapture: this.form.get('capturedUser').value,
          pUserAuthorize: this.form.get('authorizedUser').value,
          pUserRequest: this.form.get('requestedUser').value,
          pFormPay: this.form.get('formPayment').value,
          pEventId: +this.eventNumber,
          pLotePub: this.lotNumber.value,
        })
        .pipe(catchError(x => of({ data: false, message: x })))
    );
  }

  async generateFolio() {
    if (!this.dataService.validPayment) {
      if (!this.validatePaymentCamps(this.dataService.data)) {
        return;
      }
      const responsePayments = await this.validPayments();
      // console.log(responsePayments);
      if (responsePayments.message[0] !== 'OK') {
        this.alert(
          'error',
          'Sucedió un error en la validación de pagos',
          'Favor de verificar'
        );
        return;
      } else {
        this.dataService.validPayment = true;
      }
    }

    if (this.folioUniversal && this.folioUniversal.value) {
      // debugger;
      this.alert('error', 'Generar Folio', 'El gasto ya cuenta con un folio');
      return;
    }
    let FOLIO_ASOC: any;
    const DESCR =
      'ID GASTO: ' +
      this.expenseNumber +
      ' CANCELACION DE VENTA POR SOLICITUD DE AUTORIDAD';
    let filterDataComposition = this.dataService.dataCompositionExpenses.filter(
      row => row.expendientNumber !== null
    );

    if (filterDataComposition.length === 0) {
      this.alert(
        'warning',
        'No cuenta con expediente en los detalles de gasto para continuar',
        ''
      );
      return;
    }
    if (!this.userData) {
      this.alert(
        'warning',
        'No cuenta con data de usuario válida para continuar',
        ''
      );
      return;
    }
    filterDataComposition.forEach(async (x, index) => {
      debugger;
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
            id: this.userData['id'],
            natureDocument: 'ORIGINAL',
            descriptionDocument: DESCR,
            significantDate: format(new Date(), 'MM/yyyy'),
            scanStatus: index === 0 ? 'SOLICITADO' : 'ESCANEADO',
            fileStatus: '',
            userRequestsScan: this.user.preferred_username,
            scanRequestDate: new Date(),
            userRegistersScan: this.user.preferred_username,
            dateRegistrationScan: null,
            userReceivesFile: '',
            dateReceivesFile: null,
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
            sendDate: null,
            sendFilekey: '',
            userResponsibleFile: '',
            mediumId: '',
            associateUniversalFolio: index > 0 ? FOLIO_ASOC : 0,
            dateRegistrationScanningHc: null,
            dateRequestScanningHc: null,
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
            this.alert('error', 'No se pudo generar el folio de escaneo', '');
            return;
          }
          if (index === 0) {
            this.alert('success', 'Se generó el folio de escaneo', '');
            this.folioUniversal.setValue(createDocument.id);
          }
        }
      }
    });
  }

  goToScan() {
    localStorage.setItem('eventExpense', JSON.stringify(this.dataService.data));

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
      this.serviceDocuments.getByFolio(this.folioUniversal.value).subscribe(
        res => {
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
        },
        err => {
          this.alert('warning', 'No existe documentación para este folio', '');
        }
      );
    } else {
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
    }
  }
}
