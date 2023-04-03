import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CoverExpedientService } from 'src/app/core/services/ms-cover-expedient/cover-expedient.service';
import { ExpedientSamiService } from 'src/app/core/services/ms-expedient/expedient-sami.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { RequestHelperService } from '../../../request-helper-services/request-helper.service';
import { OpenDescriptionComponent } from './open-description/open-description.component';

@Component({
  selector: 'app-associate-file',
  templateUrl: './associate-file.component.html',
  styles: [],
})
export class AssociateFileComponent extends BasePage implements OnInit {
  associateFileForm: FormGroup = new FormGroup({});
  parameter: ModelForm<IRequest>;
  users: any;
  units: any;
  files: any;
  dispositions: any;
  functionarys = new DefaultSelect();

  idUser: number;
  idUnit: number;
  ddcId: number = null;
  transferentName: string = '';
  regionalDelegacionName: string = '';

  constructor(
    private modalRef: BsModalRef,
    private bsChildModalRef: BsModalRef,
    private fb: FormBuilder,
    private externalExpedientService: CoverExpedientService,
    private transferentService: TransferenteService,
    private regioinalDelegation: RegionalDelegationService,
    private requestService: RequestService,
    private expedientSamiService: ExpedientSamiService,
    private requestHelperService: RequestHelperService,
    private wcontetService: WContentService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUserSelect(new ListParams());
    this.formsChanges();
    this.getTransferent();
    this.getRegionalDelegation();
    //this.call();
  }

  formsChanges() {
    this.associateFileForm.controls['inaiUser'].valueChanges.subscribe(data => {
      if (data) {
        this.idUser = data;
        this.getUnitSelect(new ListParams(), data);
      }
    });

    this.associateFileForm.controls['inaiUnit'].valueChanges.subscribe(data => {
      if (data) {
        this.idUnit = data;
        this.getFileSelect(new ListParams(), this.idUnit, this.idUser);
      }
    });

    this.associateFileForm.controls['inaiFile'].valueChanges.subscribe(data => {
      if (data) {
        this.getDispositionSelect(new ListParams());
      }
    });

    this.associateFileForm.controls['provisionInai'].valueChanges.subscribe(
      data => {
        if (data) {
          this.getCompleteDisposition(Number(data));
        }
      }
    );
  }

  prepareForm() {
    this.associateFileForm = this.fb.group({
      inaiUser: [null, [Validators.required]], //user
      inaiUnit: [null, [Validators.required]], //unidad
      inaiFile: [null, [Validators.required]], //file
      provisionInai: [null, [Validators.required]], //disposicion
      inaiOfficial: [null, [Validators.required]], //funcionario
      expedientDate: [null, [Validators.required]], //fecha expediente
      reserveDateInai: [null], //fecha reserva
      sheetsInai: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ], //foja
      filesInai: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      fullCoding: [null], // codificacion
      reservePeriodInai: [null], //periodo de reserva
      clasificationInai: [null], // clasificación
      documentarySectionInai: [null], //seccion documental
      documentarySeriesInai: [null], // serie documental
      vaProcedureInai: [null], // vigencia del archivo tramite
      vaConcentrationInai: [null], // vigencia archivo concentracion
      documentaryValueInai: [null], //valor documental
    });
  }

  confirm() {
    let request = this.parameter.getRawValue() as IRequest;
    if (!request.regionalDelegationId) {
      this.onLoadToast(
        'error',
        '',
        'Se requerier tener una delegacion regional'
      );
    } else if (!request.transferenceId) {
      this.onLoadToast('error', '', 'Se requerier tener una transferente');
    }
    Swal.fire({
      title: 'Generar Caratula',
      text: 'Esta seguro de querer generar una caratula?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#b38e5d',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.generateCaratula();
      }
    });
  }

  generateCaratula() {
    let request = this.parameter.getRawValue();
    let expedient = this.associateFileForm.getRawValue();
    this.loader.load = true;
    //guardar expediente
    this.expedientSamiService.create(expedient).subscribe({
      next: resp => {
        const expedient = resp;
        //verifica si fecha de recerva es nula
        if (expedient.id) {
          let resevateDate = '';
          if (expedient.reserveDateInai) {
            resevateDate = this.getDocNameDate(
              this.associateFileForm.controls['reserveDateInai'].value
            );
          } else {
            resevateDate = '';
          }
          const body = {
            funcionario: expedient['inaiOfficial'],
            usrID: expedient['inaiUser'],
            fojas: expedient['sheetsInai'],
            arhId: expedient['inaiFile'],
            legajos: expedient['filesInai'],
            fechaExpediente: this.getDocNameDate(
              this.associateFileForm.controls['expedientDate'].value
            ),
            nombreExpediente: `EXPEDIENTE ${expedient.id}. TRANSFERENTE: ${request.transferenceId}`,
            ddcid: this.ddcId,
            fechaReserva: resevateDate,
          };
          //insertar datos la caratula del expediente
          this.externalExpedientService.insertExpedient(body).subscribe({
            next: resp => {
              if (resp.InsertaExpedienteResult.Insertado === true) {
                const leagueName = new Date().toISOString();
                const requestUpdate = {
                  id: request.id,
                  recordId: expedient.id,
                  fileLeagueType: 'CREACION',
                  fileLeagueDate: leagueName,
                };
                //actualizar solicitud
                this.requestService
                  .update(requestUpdate.id, requestUpdate)
                  .subscribe({
                    next: (resp: any) => {
                      const solicitud = resp as any;
                      if (solicitud.id) {
                        //llamar al reporte caratula inai
                        this.wcontetService
                          .downloadCaratulaINAIFile(
                            'Etiqueta_INAI',
                            solicitud.id
                          )
                          .subscribe({
                            next: resp => {
                              const file: any = resp;
                              const docName = `Reporte_${94}${this.getDocNameDate()}`;
                              const body = {
                                ddocTitle:
                                  'Caratula del Expediente ' +
                                  solicitud.recordId,
                                ddocAuthor: '',
                                ddocType: '',
                                ddocCreator: '',
                                ddocName: docName,
                                dID: '',
                                dSecurityGroup: 'Public',
                                dDocAccount: '',
                                dDocId: '',
                                dInDate: this.setDate(new Date()),
                                dOutDate: '',
                                dRevLabel: '',
                                xIdcProfile: '',
                                xDelegacionRegional:
                                  solicitud.regionalDelegationId,
                                xidTransferente: solicitud.transferenceId ?? '',
                                xidBien: '',
                                xidExpediente: solicitud.recordId,
                                xidSolicitud: solicitud.id,
                                xNombreProceso: 'Captura Solicitud',
                                xestado: solicitud.stationId ?? '',
                                xnoOficio: solicitud.paperNumber ?? '',
                                xremitente: solicitud.nameOfOwner ?? '',
                                xnivelRegistroNSBDB: 'Expediente',
                                xcargoRemitente: solicitud.holderCharge ?? '',
                                xtipoDocumento: '94',
                                xcontribuyente:
                                  solicitud.contribuyente_indiciado ?? '',
                              };
                              const form = JSON.stringify(body);
                              //se guarda el file y el documento
                              this.wcontetService
                                .addDocumentToContent(
                                  docName,
                                  '.pdf',
                                  form,
                                  file,
                                  'pdf'
                                )
                                .subscribe({
                                  next: resp => {
                                    const reporteName = resp.dDocName;
                                    console.log(reporteName);
                                    //se arma los parametros y se habre un modal
                                    const autoridad: any =
                                      this.authService.decodeToken();
                                    const parameters = {
                                      idExpedient: expedient.id,
                                      expedientDate: this.setDate(
                                        this.associateFileForm.controls[
                                          'expedientDate'
                                        ].value
                                      ),
                                      usrCreation: autoridad.username,
                                      dateCreation: this.setDate(new Date()),
                                      docName: reporteName,
                                    };
                                    this.loader.load = false;
                                    this.openModal(
                                      OpenDescriptionComponent,
                                      parameters
                                    );
                                    this.close();
                                  },
                                  error: error => {
                                    this.loader.load = false;
                                    this.onLoadToast(
                                      'error',
                                      'Error',
                                      'Error guardar la caratula al contenedor'
                                    );
                                  },
                                });
                            },
                            error: error => {
                              this.loader.load = false;
                              this.onLoadToast(
                                'error',
                                'Error',
                                'Error al generar la caratula'
                              );
                            },
                          });
                      } else {
                        this.loader.load = false;
                        console.log('error');
                        this.onLoadToast(
                          'error',
                          'Error',
                          `No se inserto los datos el expediente!:
                            ${resp.InsertaExpedienteResult.CodCompleta}`
                        );
                      }
                    },
                    error: error => {
                      this.loader.load = false;
                      this.onLoadToast(
                        'error',
                        'Error',
                        'Error al actualizar la solicitud'
                      );
                    },
                  });
              }
            },
            error: error => {
              this.loader.load = false;
              this.onLoadToast(
                'error',
                'Error',
                'Error al insertar la documentacion'
              );
            },
          });
        }
      },
    });
  }

  createPDF(resp: any, docName: string) {
    const byteString = window.atob(resp);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([int8Array], { type: 'application/pdf' });
    var downloadURL = window.URL.createObjectURL(blob);
    // open the window
    var newWin = window.open(downloadURL, `${docName}.pdf`);
  }

  setDate(date: Date) {
    const newDate =
      date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return newDate;
  }

  getDocNameDate(date?: any): string {
    let newDate: any;
    if (!date) {
      const oldDate = new Date();
      newDate =
        oldDate.getFullYear() +
        '' +
        this.setMonthsAndDay(oldDate.getMonth() + 1) +
        '' +
        this.setMonthsAndDay(oldDate.getDate());
    } else {
      const oldDate = date;
      newDate =
        oldDate.getFullYear() +
        '' +
        this.setMonthsAndDay(oldDate.getMonth() + 1) +
        '' +
        this.setMonthsAndDay(oldDate.getDate());
    }

    return newDate.toString();
  }

  setMonthsAndDay(month: number) {
    let result = month.toString();
    if (month === 1) {
      result = '01';
    } else if (month === 2) {
      result = '02';
    } else if (month === 3) {
      result = '03';
    } else if (month === 4) {
      result = '04';
    } else if (month === 5) {
      result = '05';
    } else if (month === 6) {
      result = '06';
    } else if (month === 7) {
      result = '07';
    } else if (month === 8) {
      result = '08';
    } else if (month === 9) {
      result = '09';
    }

    return result;
  }
  convertdateNumeric(date: Date) {
    return date.getFullYear() + '' + date.getMonth() + '' + date.getDate();
  }

  close() {
    this.modalRef.hide();
  }

  getUserSelect(params: ListParams) {
    this.externalExpedientService.getUsers(params).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenUsuarioResult.Usuario;
        this.users = data; //new DefaultSelect(data, data.length);
      },
    });
  }

  getUnitSelect(params: ListParams, userId?: number) {
    this.externalExpedientService.getUnits(userId).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenUnidadResult.Unidad;
        this.units = data; //new DefaultSelect(data, data.length);
      },
    });
  }

  getFileSelect(params: ListParams, unitId?: number, userId?: number) {
    this.externalExpedientService.getFiles(unitId, userId).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenArchivoResult.Archivo;
        this.files = data; //new DefaultSelect(data, data.length);
      },
    });
  }

  getDispositionSelect(params: ListParams) {
    this.externalExpedientService.getDisposition(params).subscribe({
      next: (resp: any) => {
        const data = resp.ObtenDisposicionResult.Disposicion;
        this.dispositions = data;
      },
    });
  }

  getCompleteDisposition(id: string | number) {
    this.externalExpedientService.getCompleteDisposition(id).subscribe({
      next: (resp: any) => {
        const disposition = resp.ObtenDisposicionCompletaResult.Disposicion[0];
        this.ddcId = disposition.ddcId;
        this.associateFileForm.controls['fullCoding'].setValue(
          disposition.ddcCodificacion
        );
        this.associateFileForm.controls['reservePeriodInai'].setValue(
          disposition.PeriodoReserva
        );

        this.associateFileForm.controls['clasificationInai'].setValue(
          disposition.TClasificacion
        );

        this.associateFileForm.controls['documentarySectionInai'].setValue(
          disposition.SeccionDocumental
        );

        this.associateFileForm.controls['documentarySeriesInai'].setValue(
          disposition.SerieDocumental
        );

        this.associateFileForm.controls['vaProcedureInai'].setValue(
          disposition.VArchivoTramite
        );

        this.associateFileForm.controls['vaConcentrationInai'].setValue(
          disposition.VArchivoConcentracion
        );

        this.associateFileForm.controls['documentaryValueInai'].setValue(
          disposition.ValoresDocumentales
        );
      },
    });
  }

  getTransferent() {
    var id = this.parameter.value.transferenceId;
    this.transferentService.getById(id).subscribe({
      next: resp => {
        this.transferentName = resp.nameTransferent;
      },
    });
  }

  getRegionalDelegation() {
    var id = this.parameter.value.regionalDelegationId;
    this.regioinalDelegation.getById(id).subscribe({
      next: resp => {
        this.regionalDelegacionName = resp.description;
      },
    });
  }

  message(header: any, title: string, body: string) {
    setTimeout(() => {
      this.onLoadToast(header, title, body);
    }, 2000);
  }

  openModal(component: any, parameters?: any) {
    let config: ModalOptions = {
      initialState: {
        parameter: parameters,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);

    /*this.bsModalRef.content.event.subscribe((res: any) => {
      this.matchLevelFraction(res);
    });*/
  }
}
