import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-scan-file-massive-conversion',
  templateUrl: './scan-file.component.html',
  standalone: true,
  imports: [CommonModule, SharedModule],
  styleUrls: [],
})
export class ScanFileComponent extends BasePage implements OnInit {
  //Inputs
  @Input() form: FormGroup;
  @Input() formControlName: string = 'folioEscaneo';
  @Input() package: any;

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  constructor(
    private serviceDocuments: DocumentsService,
    private serviceNotification: NotificationService,
    private serviceUser: UsersService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private serviceParameterG: ParametersService,
    private serviceProcVal: ProceedingsDeliveryReceptionService
  ) {
    super();
  }

  //GENERAR FOLIO DE ESCANEO
  generateFolio() {
    if (this.package.statuspack != 'A' && this.package.cvePackage != null) {
      if (this.form.get(this.formControlName).value != null) {
        this.alert('warning', 'El paquete ya tiene folio de escaneo', '');
      } else {
        this.alertQuestion(
          'question',
          'Se generará un nuevo folio de escaneo para el paquete autorizado',
          '¿Desea continuar?'
        ).then(q => {
          if (q.isConfirmed) {
            let V_NO_EXPEDIENTE = 0;
          }
        });
      }
    }

    /* if (['CERRADO', 'CERRADA', null].includes(this.statusProceeding)) {
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
              const user =
                localStorage.getItem('username') == 'sigebiadmon'
                  ? localStorage.getItem('username')
                  : localStorage.getItem('username').toLocaleUpperCase();
              const routeUser = `?filter.name=$eq:${user}`;
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
                    userRequestsScan: user,
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
    } */
  }
}
