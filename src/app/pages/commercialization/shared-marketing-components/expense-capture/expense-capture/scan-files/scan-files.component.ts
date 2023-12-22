import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of, take, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { ExpenseLotService } from '../../services/expense-lot.service';

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
    private lotService: ExpenseLotService,
    private goodFinderService: GoodFinderService,
    private sirsaeService: InterfacesirsaeService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
    this.dataService.formScan = this.fb.group({
      folioUniversal: [null, [Validators.required]],
    });
  }

  get form() {
    return this.dataService.form;
  }

  get formScan() {
    return this.dataService.formScan;
  }

  // set form(value) {
  //   this.dataService.formScan = value;
  // }

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
    // console.log(this.user);
    const routeUser = `?filter.id=$eq:${this.user.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(res => {
      // console.log(res);
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

    this.dataService.updateFolio.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        if (this.address !== 'M') {
          const folio = localStorage.getItem('fcomer084I_folio');
          if (folio) {
            this.folioUniversal.setValue(+folio);
            // setTimeout(() => {
            //   localStorage.removeItem('fcomer084I_folio');
            // }, 500);
          }
        }

        const filterParams = new FilterParams();
        filterParams.addFilter('goodNumber', this.expenseNumber.value);
        filterParams.addFilter(
          'associateUniversalFolio',
          SearchFilter.NULL,
          SearchFilter.NULL
        );
        this.serviceDocuments
          .getAll(filterParams.getParams())
          .pipe(take(1))
          .subscribe({
            next: response => {
              if (response && response.data) {
                console.log(response);
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

  get folioUniversal() {
    return this.formScan.get('folioUniversal');
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }

  get eventNumber() {
    return this.form.get('eventNumber');
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get address() {
    return this.dataService.address;
  }

  private async generateFolioI(bien: IComerDetExpense2) {
    let filterParams = new FilterParams();
    filterParams.addFilter('id', bien.goodNumber);
    let expedientes = await firstValueFrom(
      this.goodFinderService.goodFinder(filterParams.getParams()).pipe(
        catchError(x => of({ data: [] })),
        map(x => x.data)
      )
    );
    console.log(expedientes);

    expedientes.forEach(async (x, index) => {
      const DESCR =
        'BIEN: ' +
        bien.goodNumber +
        ' CANCELACION DE VENTA POR SOLICITUD DE AUTORIDAD';
      const route = `notification?filter.wheelNumber=$not:$null&filter.expedientNumber=$eq:${x.flyerNumber}&sortBy=wheelNumber:DESC`;
      const notifications = await firstValueFrom(
        this.serviceNotification.getAllFilter(route).pipe(
          catchError(x => of({ data: [] })),
          map(x => x.data)
        )
      );
      const DATO4 =
        notifications.length > 0 ? notifications[0]['wheelNumber'] : null;
      let scanStatus: string;
      scanStatus = 'SOLICITADO';
      console.log(x);
      // return;
      let createDocument = await this.setFolio(
        DESCR,
        DATO4,
        x.flyerNumber,
        scanStatus,
        this.folioUniversal.value
      );
      if (!createDocument) {
        this.alert('error', 'No se pudo generar el folio de escaneo', '');
        return;
      }
      this.folioUniversal.setValue(createDocument.id);
      await firstValueFrom(
        this.serviceDocuments
          .update(this.folioUniversal.value, {
            associateUniversalFolio: this.folioUniversal.value,
          })
          .pipe(
            catchError(x => {
              return of(null);
            })
          )
      );
      await firstValueFrom(
        this.lotService
          .foliosAsociadosExpediente_a_Null(this.expenseNumber.value)
          .pipe(catchError(x => of(null)))
      );
      //Agregar update
    });
    this.loader.load = false;
  }

  private async generateFolioM() {
    let expedientes = await firstValueFrom(
      this.lotService
        .spentExpedientWhere(this.expenseNumber.value)
        .pipe(take(1))
    );
    if (expedientes.length === 0) {
      this.loader.load = false;
      return;
    }
    expedientes.forEach(async (x, index) => {
      const DESCR =
        'ID GASTO: ' +
        this.expenseNumber.value +
        ' CANCELACION DE VENTA POR SOLICITUD DE AUTORIDAD';
      const route = `notification?filter.wheelNumber=$not:$null&filter.expedientNumber=$eq:${x}&sortBy=wheelNumber:DESC`;
      const notifications = await firstValueFrom(
        this.serviceNotification
          .getAllFilter(route)
          .pipe(catchError(x => of(null)))
      );
      if (notifications) {
        const DATO4 = notifications.data[0]['wheelNumber'];
        let scanStatus: string;
        scanStatus = index === 0 ? 'SOLICITADO' : 'ESCANEADO';

        let createDocument = await this.setFolio(
          DESCR,
          DATO4,
          x,
          scanStatus,
          this.folioUniversal.value
        );
        if (!createDocument) {
          this.alert('error', 'No se pudo generar el folio de escaneo', '');
          return;
        } else {
          this.alert('success', 'Folio generado correctamente', '');
        }
        this.folioUniversal.setValue(createDocument.id);
      }
    });
    this.loader.load = false;
  }

  private async setFolio(
    descriptionDocument,
    DATO4,
    numberProceedings,
    scanStatus: string,
    associateUniversalFolio
  ) {
    const modelDocument: IDocuments = {
      id: this.userData['id'],
      natureDocument: 'ORIGINAL',
      descriptionDocument,
      significantDate: format(new Date(), 'MM/yyyy'),
      scanStatus,
      userRequestsScan: this.user.preferred_username,
      scanRequestDate: new Date(),
      userRegistersScan: this.user.preferred_username,
      keyTypeDocument: 'ENTRE',
      keySeparator: '60',
      numberProceedings,
      numberDelegationRequested: this.userData.usuario.delegationNumber,
      numberSubdelegationRequests: this.userData.usuario.subdelegationNumber,
      numberDepartmentRequest: this.userData.usuario.departamentNumber,
      flyerNumber: DATO4,
      associateUniversalFolio,
      goodNumber: this.expenseNumber.value,
    };
    return firstValueFrom(
      this.serviceDocuments.create(modelDocument).pipe(
        catchError(x => {
          return of(null);
        })
      )
    );
  }

  async generateFolio() {
    if (this.folioUniversal && this.folioUniversal.value) {
      this.alert('error', 'Generar Folio', 'El gasto ya cuenta con un folio');
      return;
    }

    let bienes: IComerDetExpense2[] = [];
    bienes = this.dataService.dataCompositionExpenses.filter(x => x.goodNumber);
    if (bienes.length === 0) {
      this.alert(
        'warning',
        'No tiene bienes en composición de gastos para continuar',
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
    this.loader.load = true;
    this.generateFolioM();
    // if (this.address === 'M') {
    //   this.generateFolioM();
    // } else {
    //   this.generateFolioI(bienes[0]);
    // }
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
        PARAMFORM: 'NO',
        DESTYPE: 'PREVIEW',
        PRINTJOB: 'YES',
      };
      this.downloadReport('RGERGENSOLICDIGIT', params);
    } else {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
    }
  }

  //CONSULTA DE IMAGENES
  seeImages() {
    if (this.folioUniversal.value != null) {
      this.loader.load = true;
      this.serviceDocuments.getByFolio(this.folioUniversal.value).subscribe(
        res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          const idMedium = data.data[0]['mediumId'];

          if (scanStatus === 'ESCANEADO') {
            this.loader.load = false;
            this.goToScan();
          } else {
            this.loader.load = false;
            this.alert(
              'warning',
              'No existe documentación para este folio',
              ''
            );
          }
        },
        err => {
          this.loader.load = false;
          this.alert('warning', 'No existe documentación para este folio', '');
        }
      );
    } else {
      this.loader.load = false;
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
    }
  }
}
