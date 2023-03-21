import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CoverExpedientService } from 'src/app/core/services/ms-cover-expedient/cover-expedient.service';
import { ExpedientSamiService } from 'src/app/core/services/ms-expedient/expedient-sami.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { RequestHelperService } from '../../../request-helper-services/request-helper.service';

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
    private fb: FormBuilder,
    private externalExpedientService: CoverExpedientService,
    private transferentService: TransferenteService,
    private regioinalDelegation: RegionalDelegationService,
    private requestService: RequestService,
    private expedientSamiService: ExpedientSamiService,
    private requestHelperService: RequestHelperService,
    private wcontetService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getUserSelect(new ListParams());
    this.formsChanges();
    this.getTransferent();
    this.getRegionalDelegation();
    console.log(this.parameter.getRawValue());
    this.call();
    /* let parameters = {
      xIdTransferente: request.transferenceId,
      xidExpediente: '',
      xidSolicitud: request.id,
      xestado: request.keyStateOfRepublic,
      tipoUse: 'AsociarExpedient',
      xNombreProceso: 'Captura Solicitud',
    }; */
  }

  call() {
    debugger;
    this.wcontetService.callReportFile('Etiqueta_INAI', '4325').subscribe({
      next: (resp: any) => {
        console.log(resp);
        //const file = resp;
        /*let Filetype = 'pdf';
        let binary = '';
        const bytes = new Uint8Array(resp);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const file = window.btoa(binary);
        const mimType =
          Filetype === 'pdf'
            ? 'application/pdf'
            : Filetype === 'xlsx'
            ? 'application/xlsx'
            : Filetype === 'pptx'
            ? 'application/pptx'
            : Filetype === 'csv'
            ? 'application/csv'
            : Filetype === 'docx'
            ? 'application/docx'
            : Filetype === 'jpg'
            ? 'application/jpg'
            : Filetype === 'png'
            ? 'application/png'
            : '';
        const url = `data:${mimType};base64,` + file;

        console.log(url);

        const arr = url.split(',');
        if (arr.length < 2) {
          return undefined;
        }
        const mimeArr = arr[0].match(/:(.*?);/);
        if (!mimeArr || mimeArr.length < 2) {
          return undefined;
        }
        const mime = mimeArr[1];
        const buff = Buffer.from(arr[1], 'base64');
        let res = new File([buff], '.pdf', { type: mime });

        console.log(res);*/
        const form = {
          ddocTitle: 'Caratula del Expediente test',
          ddocAuthor: '',
          ddocType: '',
          ddocCreator: '',
          ddocName: 'REPORTE_10620230319',
          dID: '',
          dSecurityGroup: 'Public',
          dDocAccount: '',
          dDocId: '',
          dInDate: '08-May-2022',
          dOutDate: '',
          dRevLabel: '',
          xIdcProfile: '',
          xDelegacionRegional: 3,
          xidTransferente: '',
          xidBien: '',
          xidExpediente: '35015',
          xidSolicitud: '39567',
        };

        /* this.wcontetService
          .addDocumentToContent(
            'Contents',
            '.pdf',
            JSON.stringify(form),
            resp,
            'pdf'
          )
          .subscribe({
            next: resp => {
              console.log(resp);
            },
          }); */
      },
      error: error => {
        console.log(error);
      },
    });
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
    let request = this.parameter.getRawValue();
    let expedient = this.associateFileForm.getRawValue();

    /*  const body = {
      funcionario: this.associateFileForm.controls['inaiOfficial'].value, //'inaiOfficial', //69
      usrID: this.associateFileForm.controls['inaiUser'].value, //10539
      fojas: this.associateFileForm.controls['sheetsInai'].value, //2
      arhId: this.associateFileForm.controls['inaiFile'].value, //96827
      legajos: this.associateFileForm.controls['filesInai'].value, //22
      fechaExpediente: this.setDate(
        this.associateFileForm.controls['expedientDate'].value
      ), //22/03/2023
      nombreExpediente:
        'EXPEDIENTE ' +
        37411 +
        '. TRANSFERENTE: ' +
        this.parameter.value.transferenceId,
      ddcid: this.ddcId, //900
      fechaReserva: this.setDate(
        this.associateFileForm.controls['reserveDateInai'].value
      ), //25/03/2023
    }; */

    this.expedientSamiService.create(expedient).subscribe({
      next: resp => {
        const expedient = resp;
        if (expedient.id) {
          /* const body = {};
                this.externalExpedientService.insertExpedient(body).subscribe({
                  next: resp => { */

          const leagueName = new Date().toISOString();
          const requestUpdate = {
            id: request.id,
            recordId: expedient.id,
            fileLeagueType: 'CREACION',
            fileLeagueDate: leagueName,
          };
          this.requestService
            .update(requestUpdate.id, requestUpdate)
            .subscribe({
              next: resp => {
                const solicitud = resp;
                debugger;
                if (solicitud.id) {
                  //llama al reporte
                  this.wcontetService
                    .callReportFile('Etiqueta_INAI', solicitud.id)
                    .subscribe({
                      next: resp => {
                        const file: any = resp;
                        const docName = `Reporte_${94}${this.getDocNameDate}`;
                        const body = {
                          ddocTitle:
                            'Caratula del Expediente ' + solicitud.recordId,
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
                          xDelegacionRegional: solicitud.regionalDelegacionId,
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
                        this.wcontetService
                          .addDocumentToContent('', '.pdf', form, file, 'pdf')
                          .subscribe({
                            next: resp => {
                              console.log(resp);
                            },
                          });
                      },
                    });
                }
              },
            });

          /*  }
                }) */
        }
      },
    });

    /* this.expedientSamiService.create(expedient).subscribe({
      next: expedient => {
        if (expedient.id) {
          debugger;
          request.recordId = expedient.id;*/

    /*//actualiza la solicitud
    this.requestService.update(request.id, request).subscribe({
            next: resp => {
              if (resp.id) {
                 let wcontent: IWContent = {};
                wcontent.ddocTitle = 'Public';
                wcontent.ddocTitle = `Caratula del Expediente ${resp.recordId}`;
                wcontent.xdelegacionRegional = resp.regionalDelegationId;
                wcontent.xestado = resp.stationId;
                wcontent.xidTransferente = resp.transferenceId;
                wcontent.xnoOficio = resp.paperNumber;
                wcontent.xremitente = resp.nameOfOwner;
                wcontent.xnivelRegistroNSBDB = 'Expediente';
                wcontent.xidExpediente = resp.recordId;
                wcontent.xidSolicitud = resp.id;
                wcontent.xcargoRemitente = resp.holderCharge;
                wcontent.xcontribuyente = resp.contribuyente_indiciado ?? '';
                wcontent.xtipoDocumento = '';
                wcontent.xnombreProceso = 'Captura Solicitud';




                //this.closeAssociateExpedientTab();
                //this.close();
              }
            },
          });*/
    /*  } else {
          this.message(
            'error',
            'Error en el expediente',
            'Ocurrio un erro al guardar el expediente'
          );
        }
      },
    });*/
  }

  setDate(date: Date) {
    const newDate =
      date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    return newDate;
  }

  getDocNameDate() {
    const date = new Date();
    const newDate = date.getFullYear();
    +'' + date.getMonth() + '' + date.getDate();
    return newDate;
  }

  close() {
    this.modalRef.hide();
  }

  closeAssociateExpedientTab() {
    this.requestHelperService.associateExpedient(true);
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
}
