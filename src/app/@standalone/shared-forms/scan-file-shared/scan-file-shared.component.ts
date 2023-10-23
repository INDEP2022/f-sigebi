import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewDocumentsComponent } from '../../preview-documents/preview-documents.component';

@Component({
  selector: 'app-scan-file-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './scan-file-shared.component.html',
})
export class ScanFileSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() formControlName: string = 'folioEscaneo';
  @Input() cveDocument: string;
  @Input() noExpedient: string | number;
  @Input() statusProceeding: string;
  @Input() cveScreen: string;
  @Input() reportPrint: string;
  @Input() replicateFolioView: boolean = true;
  @Input() actaSC: boolean = false;
  @Input() disabled: boolean = false;

  @Output() emitfileNumber = new EventEmitter();

  //REPORTES
  loadingText = 'Cargando ...';

  constructor(
    private serviceDocuments: DocumentsService,
    private serviceNotification: NotificationService,
    private serviceUser: UsersService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private serviceParameterG: ParametersService,
    private authService: AuthService,
    private serviceProcVal: ProceedingsDeliveryReceptionService
  ) {
    super();
  }

  ngOnInit(): void {}

  prepareForm() {}

  replicateFolio() {
    if (
      !['CERRADO', 'CERRADA', null].includes(this.statusProceeding) ||
      this.cveDocument == null
    ) {
      this.alertQuestion(
        'question',
        'Se generará un nuevo folio de escaneo y se le copiarán las imágenes del folio de escaneo actual',
        '¿Deseas continuar?',
        'Continuar'
      ).then(q => {
        if (q.isConfirmed) {
          this.loading = true;
          if (this.form.get(this.formControlName).value == null) {
            this.loading = false;
            this.alert(
              'warning',
              'Especificque el folio de escaneo a replicar',
              ''
            );
          } else {
            const routeFilter = `?filter.associateUniversalFolio=$null&filter.scanStatus=$eq:ESCANEADO&filter.id=$eq:${
              this.form.get(this.formControlName).value
            }`;
            this.serviceDocuments.getAllFilter(routeFilter).subscribe(
              res => {
                console.log(res);
                const route = `notification?filter.wheelNumber=$not:$null&filter.expedientNumber=$eq:${this.noExpedient}&sortBy=wheelNumber:DESC`;
                this.serviceNotification.getAllFilter(route).subscribe(resp => {
                  const wheelNumber = resp.data[0]['wheelNumber'];
                  const user = this.authService.decodeToken();
                  const routeUser = `?filter.id=$eq:${user.preferred_username}`;
                  this.serviceUser.getAllSegUsers(routeUser).subscribe(
                    res => {
                      console.log(res);
                      const resJson = JSON.parse(JSON.stringify(res.data[0]));
                      console.log(resJson);
                      const modelDocument: IDocuments = {
                        id: res.data[0]['id'],
                        natureDocument: 'ORIGINAL',
                        descriptionDocument: `ACTA ${this.cveDocument}`,
                        significantDate: format(new Date(), 'MM/yyyy'),
                        scanStatus: 'ESCANEADO',
                        fileStatus: '',
                        userRequestsScan: user.preferred_username,
                        scanRequestDate: new Date(),
                        userRegistersScan: user.preferred_username,
                        dateRegistrationScan: undefined,
                        userReceivesFile: '',
                        dateReceivesFile: undefined,
                        keyTypeDocument: 'ENTRE',
                        keySeparator: '60',
                        numberProceedings: this.noExpedient,
                        sheets: '',
                        numberDelegationRequested:
                          resJson.usuario.delegationNumber,
                        numberSubdelegationRequests:
                          resJson.usuario.subdelegationNumber,
                        numberDepartmentRequest:
                          resJson.usuario.departamentNumber,
                        registrationNumber: 0,
                        flyerNumber: wheelNumber,
                        userSend: '',
                        areaSends: '',
                        sendDate: undefined,
                        sendFilekey: '',
                        userResponsibleFile: '',
                        mediumId: '',
                        associateUniversalFolio: 0,
                        dateRegistrationScanningHc: undefined,
                        dateRequestScanningHc: undefined,
                        goodNumber: 0,
                      };

                      console.log(modelDocument);
                      this.serviceDocuments.create(modelDocument).subscribe(
                        res => {
                          console.log(res.id);
                          this.form.get(this.formControlName).setValue(res.id);

                          const params = {
                            pn_folio: res.id,
                          };

                          this.downloadReport('RGERGENSOLICDIGIT', params);
                        },
                        err => {
                          this.alert(
                            'error',
                            'Se presentó un error inesperado',
                            ''
                          );
                          this.loading = false;
                        }
                      );
                    },
                    err => {
                      console.log(err);
                      this.alert(
                        'error',
                        'Se presentó un error inesperado',
                        ''
                      );
                      this.loading = false;
                    }
                  );
                });
              },
              err => {
                this.alert('error', 'Se presentó un error inesperado', '');
                this.loading = false;
              }
            );
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'No se puede replicar el folio de escaneo en un acta ya cerrada',
        ''
      );
    }
  }

  //GENERAR FOLIO DE ESCANEO
  generateFolio() {
    if (['CERRADO', 'CERRADA', null].includes(this.statusProceeding)) {
      this.alert(
        'warning',
        'El acta no tiene un estatus correcto para generar folio',
        ''
      );
    } else {
      let wheelNumber: string | number;
      this.alertQuestion(
        'question',
        'Va a generar un nuevo número de folio',
        '¿Está de acuerdo?'
      ).then(q => {
        if (q.isConfirmed) {
          this.loading = true;
          const route = `notification?filter.wheelNumber=$not:$null&filter.expedientNumber=$eq:${this.noExpedient}&sortBy=wheelNumber:DESC`;
          this.serviceNotification.getAllFilter(route).subscribe(
            res => {
              wheelNumber = res.data[0]['wheelNumber'];
              const user = this.authService.decodeToken();
              const routeUser = `?filter.id=$eq:${user.preferred_username}`;
              this.serviceUser.getAllSegUsers(routeUser).subscribe(
                res => {
                  console.log(res);
                  const resJson = JSON.parse(JSON.stringify(res.data[0]));
                  console.log(resJson);
                  const modelDocument: IDocuments = {
                    id: 0,
                    natureDocument: 'ORIGINAL',
                    descriptionDocument: `ACTA ${this.cveDocument}`,
                    significantDate: format(new Date(), 'MM/yyyy'),
                    scanStatus: 'SOLICITADO',
                    fileStatus: '',
                    userRequestsScan: user.preferred_username,
                    scanRequestDate: new Date(),
                    userRegistersScan: '',
                    dateRegistrationScan: undefined,
                    userReceivesFile: '',
                    dateReceivesFile: undefined,
                    keyTypeDocument: 'ENTRE',
                    keySeparator: '60',
                    numberProceedings: this.noExpedient,
                    sheets: '',
                    numberDelegationRequested: resJson.usuario.delegationNumber,
                    numberSubdelegationRequests:
                      resJson.usuario.subdelegationNumber,
                    numberDepartmentRequest: resJson.usuario.departamentNumber,
                    registrationNumber: 0,
                    flyerNumber: wheelNumber,
                    userSend: '',
                    areaSends: '',
                    sendDate: undefined,
                    sendFilekey: '',
                    userResponsibleFile: '',
                    mediumId: '',
                    associateUniversalFolio: 0,
                    dateRegistrationScanningHc: undefined,
                    dateRequestScanningHc: undefined,
                    goodNumber: 0,
                  };

                  console.log(modelDocument);
                  this.serviceDocuments.create(modelDocument).subscribe(
                    res => {
                      console.log(res.id);
                      this.form.get(this.formControlName).setValue(res.id);
                      const params = {
                        pn_folio: res.id,
                      };

                      const modelEdit: IProccedingsDeliveryReception = {
                        universalFolio: parseInt(
                          this.form.get(this.formControlName).value
                        ),
                      };
                      const paramsF = new FilterParams();
                      paramsF.addFilter(
                        'keysProceedings',
                        this.form.get('acta2').value
                      );
                      /* if (this.actaSC) {
                        paramsF.addFilter(
                          'keysProceedings',
                          this.form.get('acta2').value
                        );
                      } else {
                        paramsF.addFilter(
                          'keysProceedings',
                          this.form.get(this.formControlName).value
                        );
                      } */
                      this.serviceProcVal
                        .getByFilter(paramsF.getParams())
                        .subscribe(
                          res => {
                            const resData = JSON.parse(
                              JSON.stringify(res.data[0])
                            );
                            console.log(resData.id);
                            this.serviceProcVal
                              .editProceeding(resData.id, modelEdit)
                              .subscribe(
                                res => {
                                  this.downloadReport(
                                    'RGERGENSOLICDIGIT',
                                    params
                                  );
                                },
                                err => {
                                  this.alert(
                                    'error',
                                    'Ocurrió un error al guardar el número de folio en el acta',
                                    'Por favor presione el botón guardar en la pantalla para registrar el número de folio'
                                  );
                                  this.downloadReport(
                                    'RGERGENSOLICDIGIT',
                                    params
                                  );
                                }
                              );
                          },
                          err => {
                            console.log(err);
                            this.loading = false;
                            this.alert(
                              'error',
                              'Se presentó un error inesperado',
                              ''
                            );
                          }
                        );
                    },
                    err => {
                      console.log(err);
                      this.alert(
                        'error',
                        'Se presentó un error inesperado',
                        ''
                      );
                      this.loading = false;
                    }
                  );
                },
                err => {
                  console.log(err);
                  this.alert('error', 'Se presentó un error inesperado', '');
                  this.loading = false;
                }
              );
            },
            err => {
              console.log(err);
              this.alert('error', 'Se presentó un error inesperado', '');
              this.loading = false;
            }
          );
        }
      });
    }
  }

  downloadReport(reportName: string, params: any) {
    this.loadingText = 'Generando reporte ...';
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

  //ESCANEAR
  scan() {
    if (this.form.get(this.formControlName).value != null) {
      if (
        !['CERRADO', 'CERRADA'].includes(this.statusProceeding) &&
        this.statusProceeding != null
      ) {
        if (this.form.get(this.formControlName).value != null) {
          this.alertQuestion(
            'question',
            'Se abrirá la pantalla de escaneo para el folio de escaneo del acta abierta',
            '¿Deseas continuar?',
            'Continuar'
          ).then(q => {
            if (q.isConfirmed) {
              this.savedLocal();
              this.goToScan();
            }
          });
        } else {
          this.alert('warning', 'No existe folio de escaneo a escanear', '');
        }
      } else {
        this.alert('warning', 'No se puede escanear un acta cerrada', '');
      }
    } else {
      this.alert('warning', 'No se ha registrado un folio que escanear', '');
    }
  }

  goToScan() {
    localStorage.setItem('numberExpedient', this.noExpedient.toString());

    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: {
        origin: this.cveScreen,
        folio: this.form.get(this.formControlName).value,
      },
    });
  }

  //IMPRIMIR
  printScanFile() {
    if (this.form.get(this.formControlName).value != null) {
      const params = {
        pn_folio: this.form.get(this.formControlName).value,
      };
      this.downloadReport(this.reportPrint, params);
    } else {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
    }
  }

  //CONSULTA DE IMAGENES
  seeImages() {
    if (this.form.get(this.formControlName).value != null) {
      this.serviceDocuments
        .getByFolio(this.form.get(this.formControlName).value)
        .subscribe(res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];
          const idMedium = data.data[0]['mediumId'];

          if (scanStatus === 'ESCANEADO') {
            this.savedLocal();
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

  savedLocal() {
    localStorage.setItem('expediente', this.noExpedient.toString());
    localStorage.setItem('folio', this.form.get(this.formControlName).value);
  }
}
