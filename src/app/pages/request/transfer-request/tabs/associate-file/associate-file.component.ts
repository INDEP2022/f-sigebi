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
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
  maxDate: Date;
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
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
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
        [
          Validators.pattern(NUM_POSITIVE),
          Validators.required,
          Validators.maxLength(10),
        ],
      ], //foja
      filesInai: [
        null,
        [
          Validators.pattern(NUM_POSITIVE),
          Validators.required,
          Validators.maxLength(10),
        ],
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
      this.onLoadToast('error', '', 'No cuenta con una Delegación Regional');
    } else if (!request.transferenceId) {
      this.onLoadToast('error', '', 'No cuenta con una transferente');
    }
    this.alertQuestion(
      'warning',
      'Generar Carátula',
      '¿Está seguro de querer generar la carátula?'
    ).then(val => {
      if (val.isConfirmed) {
        this.generateCaratula();
      }
    });
  }

  async generateCaratula() {
    let request = this.parameter.getRawValue();
    this.loader.load = true;

    const expedient: any = await this.saveExpedientSami();
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

      const caratulaResult: any = await this.insertCaratulaData(body);
      if (caratulaResult.InsertaExpedienteResult.Insertado === true) {
        const leagueName = new Date().toISOString();
        const requestUpdate = {
          id: request.id,
          recordId: expedient.id,
          fileLeagueType: 'CREACION',
          fileLeagueDate: leagueName,
        };

        const requestResult: any = await this.updateRequest(requestUpdate);
        if (requestResult.statusCode == 200) {
          const caratualResult = await this.downloadCaratuala(request.id);
          const file: any = caratualResult;
          const user: any = this.authService.decodeToken();
          const docName = `Reporte_${94}${this.getDocNameDate()}`;
          const body = {
            ddocTitle: 'Carátula del Expediente ' + expedient.id,
            dDocAuthor: user.username,
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
            xdelegacionRegional: request.regionalDelegationId,
            xidTransferente: request.transferenceId ?? '',
            xidBien: '',
            xidExpediente: expedient.id,
            xidSolicitud: request.id,
            //xNombreProceso: 'Captura Solicitud',
            xnombreProceso: 'Captura Solicitud',
            xestado: request.stationId ?? '',
            xnoOficio: request.paperNumber ?? '',
            xremitente: request.nameOfOwner ?? '',
            xnivelRegistroNSBDB: 'Expediente',
            xcargoRemitente: request.holderCharge ?? '',
            xtipoDocumento: '94',
            xcontribuyente: request.contribuyente_indiciado ?? '',
          };
          const form = JSON.stringify(body);
          const contentResult: any = await this.insertDataToContent(
            docName,
            form,
            file
          );
          if (contentResult) {
            const reporteName = contentResult.dDocName;
            console.log(reporteName);

            const autoridad: any = this.authService.decodeToken();
            const parameters = {
              idExpedient: expedient.id,
              expedientDate: this.setDate(
                this.associateFileForm.controls['expedientDate'].value
              ),
              usrCreation: autoridad.username,
              dateCreation: this.setDate(new Date()),
              docName: reporteName,
            };
            this.loader.load = false;
            this.openModal(OpenDescriptionComponent, parameters);
            this.close();
            this.onLoadToast('success', 'Carátula generada correctamente', '');
          }
        }
      }
    }
  }

  insertDataToContent(docName: string, form: any, file: any) {
    return new Promise((resolve, reject) => {
      this.wcontetService
        .addDocumentToContent(docName, '.pdf', form, file, 'pdf')
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            reject(false);
            this.loader.load = false;
            this.onLoadToast(
              'error',
              'Error',
              `Error insertar los datos al content ${error.error.message}`
            );
          },
        });
    });
  }
  downloadCaratuala(id: string) {
    return new Promise((resolve, reject) => {
      this.wcontetService
        .downloadCaratulaINAIFile('Etiqueta_INAI', id)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            reject(false);
            this.loader.load = false;
            this.onLoadToast(
              'error',
              'Error',
              `Error al obtener el documento ${error.error.message}`
            );
          },
        });
    });
  }

  //actualizar solicitud
  updateRequest(requestUpdate: any) {
    return new Promise((resolve, reject) => {
      this.requestService.update(requestUpdate.id, requestUpdate).subscribe({
        next: (resp: any) => {
          resolve(resp);
        },
        error: error => {
          reject(false);
          this.loader.load = false;
          this.onLoadToast(
            'error',
            'Error',
            `No se pudo actualizar la solicitud ${error.error.message}`
          );
        },
      });
    });
  }
  //insertar datos la caratula del expediente
  insertCaratulaData(body: any) {
    return new Promise((resolve, reject) => {
      this.externalExpedientService.insertExpedient(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(false);
          this.loader.load = false;
          this.onLoadToast(
            'error',
            'Error',
            `No se insertaron los datos de la carátula ${error.error.message}`
          );
        },
      });
    });
  }
  //guardar expediente
  saveExpedientSami() {
    return new Promise((resolve, reject) => {
      let expedient = this.associateFileForm.getRawValue();
      this.expedientSamiService.create(expedient).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(false);
          this.loader.load = false;
          this.onLoadToast(
            'error',
            'Error',
            `No se puede guardar el expediente SAMI ${error.error.message}`
          );
        },
      });
    });
  }

  setDate(date: Date) {
    const newDate =
      this.setMonthsAndDay(date.getDate()) +
      '/' +
      this.setMonthsAndDay(date.getMonth() + 1) +
      '/' +
      date.getFullYear();
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
    params['sortBy'] = 'Nombre:ASC';
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
