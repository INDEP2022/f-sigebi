import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  lastValueFrom,
  map,
  of,
  skip,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DateCellComponent } from 'src/app/@standalone/smart-table/date-cell/date-cell.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { _Params } from 'src/app/common/services/http.service';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import {
  IHistoryProcesdingAct,
  IPAAbrirActasPrograma,
  IPACambioStatusGood,
  ITmpProgValidation,
} from 'src/app/core/models/good-programming/good-programming';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGoodIndicator } from 'src/app/core/models/ms-event-programming/good-indicators.model';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import {
  IProceedings,
  IUpdateActasEntregaRecepcion,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { EventProgrammingService } from 'src/app/core/services/ms-event-programming/event-programing.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { FIndicaService } from 'src/app/core/services/ms-good/findica.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsDetailDeliveryReceptionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodsService } from 'src/app/core/services/ms-programming-good/programming-good.service';
import { TmpContProgrammingService } from 'src/app/core/services/ms-programming-good/tmp-cont-programming.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import {
  COLUMNS_CAPTURE_EVENTS,
  COLUMNS_CAPTURE_EVENTS_2,
} from './columns-capture-events';
import { SmartDateInputHeaderDirective } from './directives/smart-date-input.directive';
import { CaptureEventProceeding } from './utils/capture-event-proceeding';
import {
  CaptureEventRegisterForm,
  CaptureEventSiabForm,
} from './utils/capture-events-forms';
import { EventCaptureButtons } from './utils/event-capture-butttons';

interface IBlkCtrl {
  component: string | number;
  typeNum: string | number;
  typeNumCant: number;
  userLevel: string | number;
  reopenInd: string | number;
  cEvent: number;
  cQuantity: number;
  cSelAll: number;
  goodQuantity: number;
  asigTm: string | number;
  asigCb: string | number;
  txtDirSatLabel: string;
  txtDirSat: string;
  processingArea: string | number;
}

interface IGlobalV {
  paperworkArea: string;
  proceedingNum: number;
  noClosed: number;
  type: string;
  tran: string;
  cons: string;
  regi: string;
}

interface IBlkProceeding {
  txtCrtSus1: string;
  txtCrtSus2: string;
}
@Component({
  selector: 'app-event-capture',
  templateUrl: './event-capture.component.html',
  styles: [
    `
      .title {
        font-size: 15px !important;
        font-weight: 500 !important;
        position: relative !important;
      }
      .btn-return {
        color: #9d2449;
        padding-left: 0px;
        left: -10px;
        position: relative;
        display: flex;
        align-items: center;
        top: -20px;
        margin-top: 5px;

        > i {
          font-size: 35px;
        }

        &:hover {
          color: #9d2449;
        }
      }

      .r-label {
        margin-top: -14px !important;
      }

      .cantidad {
        border-radius: 10px;
        border: 1px solid #eaeaeaea;
        // width: 150px;
        padding: 8px 10px;
        position: relative;
        top: -19px;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 20px 0px rgba(69, 90, 100, 0.08) !important;

        @media screen and (max-width: 576px) {
          margin-top: 10px;
        }
      }
    `,
  ],
})
export class EventCaptureComponent
  extends BasePage
  implements OnInit, AfterViewInit
{
  @ViewChildren(SmartDateInputHeaderDirective, { read: ElementRef })
  private itemsElements: QueryList<ElementRef>;
  _today = new Date();
  _minDate: Date = null;
  saveLoading = false;

  siseLoading = false;
  eventTypes = new DefaultSelect([
    { area_tramite: 'OP', descripcion: 'Oficialía de partes' },
  ]);
  typeOtions = new DefaultSelect([
    { value: 'RT', label: 'RT' },
    { value: 'A', label: 'A' },
    { value: 'D', label: 'D' },
  ]);

  progOptions = new DefaultSelect([
    { value: 'R', label: 'R' },
    { value: 'E', label: 'E' },
  ]);

  programedOptions = new DefaultSelect([
    { value: 0, label: 'Día a Día' },
    { value: 1, label: 'Desalojo' },
  ]);
  areas = new DefaultSelect();
  transfers = new DefaultSelect();
  users = new DefaultSelect();
  originalType: string = null;
  form = this.fb.group(new CaptureEventRegisterForm());
  formSiab = this.fb.group(new CaptureEventSiabForm());
  totalItems: number = 0;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  limit: FormControl = new FormControl(10);
  detail: IGoodIndicator[] = [];
  ctrlButtons = new EventCaptureButtons();
  blkCtrl: IBlkCtrl = {
    component: null, // COMPONENTE
    typeNum: null, // NO_TIPO
    typeNumCant: null, // NO_TIPO_CANT
    userLevel: null, // NIVEL_USUARIO
    reopenInd: null, // IND_REAPERTURA
    txtDirSatLabel: 'Vo. Bo. de Sat',
    txtDirSat: null,
    cEvent: 0, // C_EVENTO
    cQuantity: 0, // C_CANTIDAD
    cSelAll: 0, // SEL_TODO
    goodQuantity: 0, //CANT_BIEN
    asigTm: null,
    asigCb: null,
    processingArea: null,
  };

  blkProceeding: IBlkProceeding = {
    txtCrtSus1: null,
    txtCrtSus2: null,
  };
  packNumCtrl = new FormControl(null);
  showPackNumCtrl = false;

  global: IGlobalV = {
    paperworkArea: 'RF', // AREA_TRAMITE
    proceedingNum: 821325, // NO_ACTA
    noClosed: null, //no_cerrado
    type: null, //TIPO
    tran: null, //TRAN
    regi: null, //REGI
    cons: null, //CONS
  };

  // BLK_CANT
  blkQuantities = {
    goods: 0,
    registers: 0,
    expedients: 0,
    dictums: 0,
  };

  handoverReceptionMinutes = {
    statusAct: 'CERRADO',
    typeAct: '',
    actaNumber: 1,
    folio: 1,
  };

  authUser: string = null;
  authUserName: string = null;

  // ACTAS_ENTREGA_RECEPCION
  proceeding: IProceedingDeliveryReception = new CaptureEventProceeding();

  defatulInputShow = false;

  private stageCreda: number | string = null;

  get registerControls() {
    return this.form.controls;
  }

  get siabControls() {
    return this.formSiab.controls;
  }

  gInitialDate: Date;
  gFinalDate: Date;

  startDateCtrl = new FormControl<Date>(null, minDate(new Date()));
  endDateCtrl = new FormControl<Date>(null);

  selectedProceedings: IGoodIndicator[] = [];

  allSelected = false;

  flag = false;

  constructor(
    private fb: FormBuilder,
    private parameterGoodService: ParametersService,
    private gParameterService: GoodParametersService,
    private authService: AuthService,
    private router: Router,
    private indUserService: IndUserService,
    private indicatorParametersService: IndicatorsParametersService,
    private proceedingDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private rNomenclaService: RNomenclaService,
    private segAccessXAreas: SegAcessXAreasService,
    private eventProgrammingService: EventProgrammingService,
    private detailDeliveryReceptionService: ProceedingsDetailDeliveryReceptionService,
    private activatedRoute: ActivatedRoute,
    private expedientService: ExpedientService,
    private dynamicCatalogService: DynamicCatalogService,
    private procedureManagementService: ProcedureManagementService,
    private procudeServ: ProcedureManagementService,
    private security: SecurityService,
    private progammingServ: ProgrammingGoodService,
    private documentsService: DocumentsService,
    private proceedingsService: ProceedingsService,
    private programmingGoodService: ProgrammingGoodsService,
    private tmpContProgrammingService: TmpContProgrammingService,
    private fIndicaService: FIndicaService,
    private excelService: ExcelService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private massiveGoodService: MassiveGoodService,
    private interfaceSirSaeService: InterfacesirsaeService
  ) {
    super();
    this.authUser = this.authService.decodeToken().preferred_username;
    this.authUserName = this.authService.decodeToken().name;
    this.settings = {
      ...this.settings,
      actions: { columnTitle: 'Acciones', delete: true, edit: false },
      columns: {
        ...COLUMNS_CAPTURE_EVENTS,
        dateapprovalxadmon: {
          title: 'Inicio',
          sort: false,
          type: 'custom',
          showAlways: true,
          renderComponent: DateCellComponent,
          onComponentInitFunction: (instance: DateCellComponent) =>
            this.setStartDate(instance),
        },
        dateindicatesuserapproval: {
          title: 'Finalización',
          sort: false,
          type: 'custom',
          showAlways: true,
          renderComponent: DateCellComponent,
          onComponentInitFunction: (instance: DateCellComponent) =>
            this.setEndDate(instance),
        },
        ...COLUMNS_CAPTURE_EVENTS_2,
      },
    };
    this.activatedRoute.queryParams.subscribe(params => {
      this.global.proceedingNum = params['numeroActa'] ?? null;
      this.global.paperworkArea = params['tipoEvento'] ?? null;
    });
  }

  async getProceedingEvent(proceeding: string) {
    return await firstValueFrom(
      this.proceedingsService.getEventByProceeding(proceeding).pipe(
        catchError(error =>
          of({ data: [{ eventId: null, programmingId: null }] })
        ),
        map(response => response.data[0].eventId)
      )
    );
  }

  async sendSISE() {
    const eventId = await this.getProceedingEvent(
      this.proceeding.keysProceedings
    );
    if (!eventId) {
      this.oldSise();
      return;
    }
    this.newSise(eventId);
  }

  newSise(iIdEvento: string | number) {
    this.siseLoading = true;
    this.interfaceSirSaeService
      .updateEventDomicile({
        cveActa: this.proceeding.keysProceedings,
        iIdEvento,
      })
      .subscribe({
        next: async () => {
          this.siseLoading = false;
          const params = new FilterParams();
          params.addFilter('id', this.global.proceedingNum);
          await this.getProceeding(params);
          if (this.proceeding.receiveBy == '1') {
            this.alert('success', 'Enviado al SISE correctamente', '');
          } else if (this.proceeding.receiveBy == '0') {
            this.alert(
              'error',
              'Error',
              'No se pudo Enviar el ejecutable del SISE, puedes reenviarlo de nuevo'
            );
          } else {
            this.alert('error', 'Error', 'Renviar de nuevo el SISE');
          }
        },
        error: () => {
          this.siseLoading = false;
          this.alert('error', 'Error', 'Ocurrió un error al enviar el SISE');
        },
      });
  }

  oldSise() {
    this.siseLoading = true;
    this.interfaceSirSaeService
      .updateInvitations({
        sRunCommand: 'registrar',
        cveCertificate: this.proceeding.keysProceedings,
      })
      .subscribe({
        next: async () => {
          this.siseLoading = false;
          const params = new FilterParams();
          params.addFilter('id', this.global.proceedingNum);
          await this.getProceeding(params);
          if (this.proceeding.receiveBy == '1') {
            this.alert('success', 'Enviado al SISE correctamente', '');
          } else if (this.proceeding.receiveBy == '0') {
            this.alert(
              'error',
              'Error',
              'No se pudo Enviar el ejecutable del SISE, puedes reenviarlo de nuevo'
            );
          } else {
            this.alert('error', 'Error', 'Renviar de nuevo el SISE');
          }
        },
        error: () => {
          this.siseLoading = false;
          this.alert('error', 'Error', 'Ocurrió un error al enviar el SISE');
        },
      });
  }

  async removeDetail(detail: any) {
    if (this.proceeding.statusProceedings.includes('CERRAD')) {
      this.alert('error', 'Error', 'El programa esta cerrado');
      return;
    }

    const response = await this.alertQuestion(
      'question',
      'Atención',
      '¿Seguro que desea eliminar el bien?'
    );
    if (response.isConfirmed) {
      this.loading = true;
      this.detailDeliveryReceptionService
        .deleteById(detail.goodnumber, Number(this.proceeding.id))
        .subscribe({
          next: () => {
            this.loading = false;
            this.alert('success', 'Bien eliminado', '');
            this.getDetail().subscribe();
            this.calculateQuantities();
          },
          error: () => {
            this.loading = false;
            this.alert(
              'error',
              'Error',
              'Ocurrio un error al eliminar el bien'
            );
          },
        });
    }
  }

  onSelectProceeding(notification: any, selected: boolean) {
    if (selected) {
      this.selectedProceedings.push(notification);
    } else {
      this.selectedProceedings = this.selectedProceedings.filter(
        proc => proc.goodnumber != proc.goodnumber
      );
    }
  }

  proceedingSelectChange(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.onSelectProceeding(data.row, data.toggle),
    });
  }

  isProceedingSelected(proceeding: IGoodIndicator) {
    if (this.allSelected) {
      return true;
    }
    const exists = this.selectedProceedings.find(
      prc => prc.goodnumber == proceeding.goodnumber
    );
    if (!exists) return false;
    return true;
  }

  setStartDate(instance: DateCellComponent) {
    instance.control.addValidators(minDate(new Date()));
    if (this.proceeding?.statusProceedings?.includes('CERRAD')) {
      instance.disabled = true;
    } else {
      instance.disabled = false;
    }
    const min = this.form.get('captureDate').value;
    instance.minDate = this._minDate;
    instance.inputChange.subscribe(val => {
      const { row, value } = val;
      row.dateapprovalxadmon = value;
      if (!row.dateapprovalxadmon && !row.dateindicatesuserapproval) {
        return;
      }
      if (!instance.control.valid) {
        return;
      }
      this.updateDetail(row);
    });
  }

  setEndDate(instance: DateCellComponent) {
    if (this.proceeding?.statusProceedings?.includes('CERRAD')) {
      instance.disabled = true;
    } else {
      instance.disabled = false;
    }
    const min = this.form.get('captureDate').value;
    instance.minDate = this._minDate;
    instance.inputChange.subscribe(val => {
      if (!val) {
        return;
      }
      instance.control.clearValidators();
      const { row, value } = val;
      if (row.dateapprovalxadmon) {
        const min = new Date(instance.rowData.dateapprovalxadmon).toISOString();
        instance.control.setValidators(minDate(new Date(min.slice(0, -1))));
      }
      instance.control.updateValueAndValidity();
      if (!instance.control.valid) {
        this.alert(
          'error',
          'Error',
          'La fecha de finalización no puede ser menor a la fecha de inicio'
        );
        instance.control.setValue(null, { emitEvent: false });
        return;
      }
      if (!row.dateapprovalxadmon && !row.dateindicatesuserapproval) {
        return;
      }
      console.log('paso');
      row.dateindicatesuserapproval = value;
      this.updateDetail(row);
    });
  }

  updateDetail(detail: any) {
    const data = {
      numberProceedings: this.proceeding.id,
      numberGood: detail.goodnumber,
      approvedDateXAdmon: detail.dateapprovalxadmon,
      dateIndicatesUserApproval: detail.dateindicatesuserapproval,
    };
    this.loading = true;
    this.detailDeliveryReceptionService.update(data as any).subscribe({
      next: res => {
        this.loading = false;
        this.alert('success', 'Fecha actualizada', '');
      },
      error: error => {
        this.loading = false;
        this.alert('error', 'Error', 'Ocurrió un error al actualizar la fecha');
      },
    });
  }

  back() {
    this.router.navigate([
      '/pages/judicial-physical-reception/scheduled-maintenance',
    ]);
  }

  async saveProceeding() {
    if (!this.registerControls.captureDate.valid) {
      this.alert('error', 'Error', 'Verifica el formulario');
      return;
    }
    if (this.proceeding.id) {
      if (this.proceeding.statusProceedings.includes('CERRAD')) {
        this.alert('error', 'Error', 'El programa esta cerrado');
        return;
      }
      this.updateProceeding().subscribe();
      return;
    }
    await this.createProceeding(true);
  }

  updateProceeding() {
    const formValue = this.form.getRawValue();
    const { numFile, keysProceedings, captureDate, responsible } = formValue;
    const data = {
      ...this.proceeding,
      numFile,
      keysProceedings,
      captureDate: new Date(
        format(captureDate, 'yyyy-MM-dd HH:mm:ss')
      ).getTime(),
      responsible,
    };
    delete data.elaborationDate;
    delete data.datePhysicalReception;
    delete data.dateElaborationReceipt;
    delete data.dateDeliveryGood;
    delete data.approvalDateXAdmon;
    delete data.closeDate;
    delete data.maxDate;
    delete data.dateCaptureHc;
    delete data.dateCloseHc;
    delete data.dateMaxHc;

    return this.proceedingDeliveryReceptionService
      .update(this.proceeding.id, data as any)
      .pipe(tap(() => this.alert('success', 'Acta actualizada', '')));
  }

  excelExport() {
    if (this.detail.length == 0) {
      this.alert('warning', 'No hay bienes agregados', '');
      return;
    }
    this.fIndicaService
      .generateExcel({
        acta: Number(this.proceeding.id),
        type: this.registerControls.typeEvent.value,
        crtSus: this.blkProceeding.txtCrtSus1,
      })
      .subscribe({
        next: data => {
          const base64 = data?.file?.base64;
          if (!base64) {
            this.alert(
              'error',
              'Error',
              'Ocurrio un error al generar el archivo'
            );
            return;
          }
          const mediaType =
            'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
          const link = document.createElement('a');
          link.href = mediaType + base64;
          link.download = `${this.proceeding.keysProceedings}.xlsx`;
          link.click();
          link.remove();
        },
        error: () => {
          this.alert(
            'error',
            'Error',
            'Ocurrio un error al generar el archivo'
          );
        },
      });
  }

  udpateProceedingExpedient() {
    const { numFile } = this.proceeding;
    return this.proceedingDeliveryReceptionService
      .update(this.proceeding.id, { numFile } as any)
      .pipe();
  }

  async createProceeding(showMessage?: boolean) {
    await this.generateCve();
    const formValue = this.form.getRawValue();
    const { numFile, keysProceedings, captureDate, responsible } = formValue;
    if (!responsible) {
      this.alert('error', 'Error', 'Eliga un responsable');
      return;
    }
    if (!numFile) {
      formValue.numFile = 2;
    }
    const elaborationDate = new Date();
    const statusProceedings = 'ABIERTA';
    const typeProceedings = this.originalType;
    const elaborate = this.authUser;
    const numDelegation1 = await this.getUserDelegation();
    const dataToSave = {
      keysProceedings,
      elaborationDate: new Date(
        format(elaborationDate, 'yyyy-MM-dd HH:mm:ss')
      ).getTime(),
      captureDate: new Date(
        format(captureDate, 'yyyy-MM-dd HH:mm:ss')
      ).getTime(),
      responsible,
      numFile: formValue.numFile,
      statusProceedings,
      typeProceedings,
      elaborate,
      numDelegation1,
    } as any;
    this.saveLoading = true;
    this.proceedingDeliveryReceptionService.create(dataToSave).subscribe({
      next: async res => {
        this.saveLoading = false;
        if (showMessage) {
          this.alert('success', 'Acta Generada Correctamente', '');
        }
        this.global.proceedingNum = res.id;
        this.global.paperworkArea = this.originalType;
        await this.initForm();
        this.registerControls.keysProceedings.setValue(
          this.proceeding.keysProceedings
        );
        // await this.generateCve();
      },
      error: error => {
        this.saveLoading = false;
        this.alert('error', 'Error', 'Ocurrió un error al guardar el acta');
      },
    });
  }

  changeStartDate(start: Date) {
    this.endDateCtrl.clearValidators();
    this.startDateCtrl.addValidators(minDate(new Date()));
    if (start) {
      this.endDateCtrl.addValidators(minDate(start));
    } else {
      this.endDateCtrl.clearValidators();
    }
    this.endDateCtrl.updateValueAndValidity();
    this.startDateCtrl.updateValueAndValidity();
  }

  changeEndDate(end: Date) {
    this.startDateCtrl.clearValidators();
    if (end) {
      this.startDateCtrl.addValidators(maxDate(end));
      this.startDateCtrl.addValidators(minDate(new Date()));
    } else {
      this.startDateCtrl.clearValidators();
      this.startDateCtrl.addValidators(minDate(new Date()));
    }
    this.startDateCtrl.updateValueAndValidity();
    this.endDateCtrl.updateValueAndValidity();
  }

  validateDates() {
    if (!this.proceeding.id) {
      this.alert('error', 'Error', 'No hay un programa');
      return;
    }
    if (this.detail.length == 0) {
      this.alert('error', 'Error', 'No hay bienes agregados');
      return;
    }
    if (this.proceeding?.statusProceedings?.includes('CERRAD')) {
      this.alert('error', 'Error', 'El programa esta cerrado');
      return;
    }
    if (!this.startDateCtrl.valid || !this.endDateCtrl.valid) {
      this.alert('error', 'Error', 'Verifique las fechas');
      return;
    }
    const start = this.startDateCtrl.value;
    const end = this.endDateCtrl.value;
    if (!start) {
      this.throwDateErrors('La fecha inicial no puede se nula');
      return;
    }

    if (!end) {
      this.throwDateErrors('La fecha final no puede ser nula');
      return;
    }

    this.detailDeliveryReceptionService
      .updateMassiveNew(
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd'),
        Number(this.proceeding.id)
      )
      .subscribe({
        next: data => {
          this.alert('success', 'Fechas actualizadas', '');
          const _params = this.params.getValue();
          const params = new FilterParams();
          params.limit = _params.limit;
          // this.params.value.limit = 10;
          this.limit = new FormControl(_params.limit);
          this.startDateCtrl.setValue(null, { emitEvent: false });
          this.endDateCtrl.setValue(null, { emitEvent: false });
          this.params.next(params);
        },
        error: error => {
          this.alert(
            'error',
            'Error',
            'Ocurrio un error al actualizar las fechas'
          );
        },
      });
  }

  generateStrategy() {
    const proceeding = this.proceeding.id;
    const type = this.proceeding.typeProceedings;
    const strategyRoute =
      'pages/final-destination-process/delivery-schedule/schedule-of-events/capture-event/generate-estrategy';
    this.router.navigate([strategyRoute], {
      queryParams: { proceeding, type },
    });
  }

  throwDateErrors(message: string) {
    this.alert('error', 'Error', message);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  async transferClick() {
    const firstDetail = this.detail[0];
    const { transference, type } = this.registerControls;
    if (!firstDetail) {
      transference.reset();
      return;
    }

    if (!firstDetail.expedientnumber) {
      transference.reset();
      return;
    }
    const { expedientnumber } = firstDetail;
    const identifier = await this.getExpedientById(expedientnumber);

    if (identifier == 'TRANS') {
      const { type, key } = await this.getTransferType(expedientnumber);
      if (type == 'E') {
        const tTrans = await this.getTTrans(expedientnumber);
        transference.setValue(tTrans);
      } else {
        transference.setValue(key);
      }
    } else {
      const tAseg = await this.getTAseg(expedientnumber);
      transference.setValue(tAseg);
    }

    const transferent = transference.value;
    this.transfers = new DefaultSelect([
      { value: transferent, label: transferent },
    ]);

    if (['PGR', 'PJF'].includes(transference.value)) {
      type.setValue('A');
    } else {
      type.setValue('RT');
    }

    await this.generateCve();
  }

  async getTAseg(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getClaveCTransparente(expedientId)
        .pipe(map(res => res.data[0].clave))
    );
  }

  async getTTrans(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getDescEmisora(expedientId)
        .pipe(map(res => res.data[0].desc_emisora))
    );
  }

  async getTransferType(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService.getIncapAndClave(expedientId).pipe(
        map(res => {
          return { type: res.data[0].coaelesce, key: res.data[0].clave };
        })
      )
    );
  }

  async getExpedientById(id: string | number) {
    return await lastValueFrom(
      this.expedientService
        .getById(id)
        .pipe(map(expedient => expedient.identifier))
    );
  }

  getUserDelegation() {
    const params = new FilterParams();
    params.addFilter('user', this.authUser);
    return lastValueFrom(
      this.segAccessXAreas
        .getAll(params.getParams())
        .pipe(map(res => res.data[0].delegationNumber))
    );
  }

  async getAreas(params: FilterParams) {
    const stage = await this.getStage();
    const delegation = await this.getUserDelegation();
    params.addFilter('stageedo', stage);
    params.addFilter('numberDelegation2', delegation);
    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: resp => {
        this.areas = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  goToGoodsTracker() {
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FINDICA_0035_1',
      },
    });
  }

  async loadGoods() {
    if (!this.proceeding.id) {
      await this.createProceeding();
    }
    const { area, keysProceedings, typeEvent } = this.registerControls;
    const totalFilters = Object.values(this.formSiab.value);
    const filters = totalFilters.map(filter =>
      Array.isArray(filter) ? filter.join(',') : filter
    );
    const nullFilters = filters.filter(filter => !filter);
    if (nullFilters.length == totalFilters.length) {
      this.alert(
        'error',
        'Error',
        'Debe ingresar almenos 1 parametro de busqueda'
      );
      return;
    }
    if (
      this.proceeding.statusProceedings == 'CERRADA' ||
      this.proceeding.statusProceedings == 'CERRADO'
    ) {
      this.alert('error', 'Error', 'El programa esta cerrado');
      return;
    }

    if (!typeEvent.value) {
      this.alert('error', 'Error', 'No se ha especificado el Tipo de Evento');
      return;
    }

    if (!keysProceedings.value) {
      this.alert('error', 'Error', 'No se ha ingresado el programa');
      return;
    }
    let continueProcess = false;
    if (this.blkCtrl.goodQuantity > 0) {
      const response = await this.alertQuestion(
        'question',
        'La asignación de bienes ya se ha realizado',
        '¿Se ejecuta nuevamente?'
      );
      continueProcess = response.isConfirmed;
    } else {
      const response = await this.alertQuestion(
        'question',
        '¿Quiere continuar con el proceso?',
        ''
      );
      continueProcess = response.isConfirmed;
    }

    if (!continueProcess) {
      return;
    }

    this.createFilters();

    if (typeEvent.value == 'RT') {
      if (this.blkProceeding.txtCrtSus1) {
        // this.pupUpdate();
      } else {
        // this.frConditions();
      }
      this.blkCtrl.asigTm = 1;
      this.blkCtrl.asigCb = 1;
    } else {
      // this.pupUpdate();
    }

    this.progTotal();
  }

  // PUP_TOTALES_PROG
  progTotal() {}

  // PUP_GENERA_WHERE
  createFilters() {
    const { typeEvent } = this.form.value;
    const {
      initialDate,
      finalDate,
      flyer,
      expedient,
      dictumCve,
      delegation,
      programed,
      cdonacCve,
      lot,
      donatNumber,
      adonacCve,
      event,
      warehouse,
      autoInitialDate,
      autoFinalDate,
      transfer,
      transmitter,
      authority,
    } = this.formSiab.value;
    console.log({ delegation });
    const body = {
      startDate: initialDate,
      endDate: finalDate,
      processingArea: typeEvent,
      steeringWheel: flyer ? `${flyer}` : null,
      proceedings: expedient ? `${expedient}` : null,
      opinion: dictumCve ? `'${dictumCve}'` : null,
      coordination:
        delegation.length > 0 ? delegation.map(d => d.id).join(',') : null,
      program: programed ? `${programed}` : null,
      cdonacKey: cdonacCve,
      idLot: lot,
      doneeNumber: donatNumber,
      adonacKey: adonacCve,
      idEvent: event,
      storeNumber: warehouse,
      iniAutDate: autoInitialDate,
      endAutDate: autoFinalDate,
      transferee: transfer.length > 0 ? transfer.join(',') : null,
      station: transmitter.length > 0 ? `(${transmitter.join('),(')})` : null,
      authority: authority.length > 0 ? `(${authority.join('),(')})` : null,
    };

    this.fIndicaService.pupGenerateWhere(body).subscribe(res => {
      this.pupUpdate();
    });
  }

  // PUP_ACTUALIZA
  pupUpdate() {
    const { typeEvent } = this.registerControls;
    const { expedient } = this.formSiab.value;
    this.loading = true;
    this.fIndicaService
      .pupUpdate(typeEvent.value, expedient, this.proceeding.id)
      .subscribe({
        next: res => {
          this.loading = false;
          if (res?.registros > 0) {
            this.alert('success', 'Bienes cargados correctamente', '');
            this.formSiab = this.fb.group(new CaptureEventSiabForm());
          } else {
            this.alert('warning', 'No se encontraron bienes para agregar', '');
          }
          const params = new FilterParams();
          const _params = this.params.getValue();
          // this.params.value.limit = 10;
          params.limit = _params.limit;
          this.limit = new FormControl(_params.limit);
          this.params.next(params);
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  // PUP_CONDICIONES_FR
  frConditions() {
    this.pupUpdate();
  }

  async getStage() {
    return await lastValueFrom(
      this.gParameterService
        .getPhaseEdo()
        .pipe(map(response => response.stagecreated))
    );
  }

  responsibleChange() {
    return this.registerControls.responsible.valueChanges.pipe(
      takeUntil(this.$unSubscribe),
      tap(value => {
        this.proceeding.responsible = value;
        this.generateCve();
      })
    );
  }

  typeEventChange() {
    return this.registerControls.typeEvent.valueChanges.pipe(
      takeUntil(this.$unSubscribe),
      tap(value => {
        if (!value) return;
        this.showPackNumCtrl = false;
        this.ctrlButtons.convPack.hide();
        this.ctrlButtons.deletePack.hide();
        this.activeFields();
        this.setProg();
      })
    );
  }

  private setProg() {
    const prog = this.registerControls.typeEvent.value == 'RF' ? 'R' : 'E';
    this.registerControls.prog.setValue(prog);
  }

  private addUsingDates(date: Date, days: number) {
    let nextDay = date;
    let daysToAdd = 1;
    while (days > 0) {
      const _nextDay = new Date(
        nextDay.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      );
      if (_nextDay.getDay() > 0 && _nextDay.getDay() < 6) {
        nextDay = _nextDay;
        daysToAdd = 1;
        days--;
      } else {
        daysToAdd++;
      }
    }
    return nextDay;
  }

  async ngOnInit() {
    this.form
      .get('captureDate')
      .valueChanges.pipe(skip(1), takeUntil(this.$unSubscribe))
      .subscribe(val => {
        this.startDateCtrl.reset();
        this.endDateCtrl.reset();
        const detail = [...this.detail];
        this.detail = [];
        this.detail = detail;
        if (!val) {
          return;
        }
        this._minDate = val ? this.addUsingDates(val, 3) : null;
      });
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          if (this.proceeding.id) {
            this.getDetail(params).subscribe();
          }
        })
      )
      .subscribe();
    const { responsible } = this.registerControls;
    responsible.valueChanges.pipe(skip(1)).subscribe(() => {
      this.generateCve();
    });
    await this.initForm();
  }

  async generateCve() {
    const {
      keysProceedings,
      year,
      month,
      user,
      area,
      folio,
      prog,
      transference,
      type,
      typeEvent,
    } = this.registerControls;
    this.global.type = null;
    this.global.tran = null;
    this.global.regi = null;

    const splitedArea = keysProceedings?.value?.split('/');
    const _area = splitedArea ? splitedArea[3] : null;
    const cons = splitedArea ? splitedArea[5] : null;
    const existingTrans = splitedArea ? splitedArea[2] : null;
    const _user = splitedArea ? splitedArea[4] : null;
    const _month = splitedArea ? splitedArea[7] : null;
    const _year = splitedArea ? splitedArea[6] : null;

    if (existingTrans) {
      if (['PGR', 'PJF'].includes(existingTrans)) {
        type.setValue('A');
      } else {
        type.setValue('RT');
      }
    }
    this.setProg();
    const currentDate = new Date();
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    year.setValue(_year ?? currentDate.getFullYear().toString().slice(2, 4));
    month.setValue(_month ?? currentMonth);
    user.setValue(_user ?? this.authUser);
    // TODO: PASAR A LA FORMA CORRECTA "VALUE" Y "LABEL"
    this.users = new DefaultSelect([
      {
        value: _user ?? this.authUser,
        label: _user ?? this.authUserName,
      },
    ]);

    this.validateTransfer(type.value ?? 'RT', transference.value);

    console.log({ area, _area });
    if (!area.value) {
      if (!_area) {
        this.global.regi = null;
        this.global.cons = null;
      } else {
        this.global.regi = _area;
        this.global.cons = cons;
      }
    } else {
      if (cons) {
        this.global.regi = area.value;
        area.setValue(this.global.regi);
        this.global.cons = cons;
        folio.setValue(this.global.cons);
      } else {
        this.global.regi = area.value;
        const indicator = await this.getProceedingType();
        const _folio = await this.getFolio(indicator.certificateType);
        this.global.cons = `${_folio}`.padStart(5, '0');
      }
    }
    if (!this.global.type) {
      this.global.type = 'RT';
    }
    folio.setValue(this.global.cons);
    const cve = `${this.global.type ?? ''}/${prog.value ?? ''}/${
      this.global.tran ?? ''
    }/${this.global.regi ?? ''}/${user.value ?? ''}/${this.global.cons ?? ''}/${
      year.value ?? ''
    }/${month.value ?? ''}`;
    // .slice(-2)
    if (!area.value && this.global.regi) {
      area.setValue(this.global.regi);
    }
    if (!transference.value && this.global.tran) {
      transference.setValue(this.global.tran);
      this.transfers = new DefaultSelect([
        { value: this.global.tran, label: this.global.tran },
      ]);
    }
    keysProceedings.setValue(cve);
  }

  async getFolio(typeProceeding: string) {
    const { type, area, year } = this.registerControls;
    const body = {
      typeProceeding,
      type: type.value,
      regional: area.value,
      year: `${year.value}`.slice(-2),
    };
    return await lastValueFrom(
      this.eventProgrammingService.getFolio(body).pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.alert('error', 'Error', 'Error en la localización del folio');
          }
          return throwError(() => error);
        }),
        map(response => response.folio)
      )
    );
  }

  // PUP_VAL_TRANF
  validateTransfer(_type: string, transfer: string) {
    this.global.tran = transfer;
    const { keysProceedings } = this.registerControls;
    const splitedArea = keysProceedings?.value?.split('/');
    const cveType = splitedArea ? splitedArea[0] : null;
    const tran = splitedArea ? splitedArea[2] : null;
    const area = splitedArea ? splitedArea[3] : null;
    if (!transfer) {
      if (!cveType) {
        this.global.type = _type;
      } else {
        this.global.type = cveType == _type ? cveType : _type;
      }

      if (!tran) {
        this.global.tran = null;
      } else {
        if (
          (tran == 'PGR' || tran == 'PJF') &&
          (_type == 'D' || _type == 'A')
        ) {
          this.global.tran = tran;
          this.global.type = _type;
        } else if (
          tran != 'PGR' &&
          tran != 'PJF' &&
          (_type == 'D' || _type == 'A')
        ) {
          this.invalidTransfer();
        } else if ((tran == 'PGR' || tran == 'PJF') && _type == 'RT') {
          this.invalidTransfer();
        } else if (tran != 'PGR' && tran != 'PJF' && _type == 'RT') {
          this.global.tran = tran;
          this.global.type = _type;
        }
      }
    } else {
      if (
        (transfer == 'PGR' || transfer == 'PJF') &&
        (_type == 'D' || _type == 'A')
      ) {
        this.global.tran = transfer;
        this.global.type = _type;
      } else if (
        transfer != 'PGR' &&
        transfer != 'PJF' &&
        (_type == 'D' || _type == 'A')
      ) {
        this.invalidTransfer();
      } else if ((transfer == 'PGR' || transfer == 'PJF') && _type == 'RT') {
        this.invalidTransfer();
      } else if (transfer != 'PGR' && transfer != 'PJF' && _type == 'Rt') {
        this.global.tran = transfer;
        this.global.type = _type;
      }
      // }
    }
  }

  invalidTransfer() {
    this.global.tran = null;
    this.alert('error', 'Error', 'La transferente no es válida para este tipo');
  }

  getInitialParameter() {
    this.parameterGoodService
      .getById('SSF3_NOM_COMPONENTE')
      .pipe(map((parameter: any) => parameter as IParameters))
      .subscribe({
        next: parameter => {
          this.blkCtrl.component = parameter.initialValue + '';
        },
        error: () => {
          this.errorForm(
            'No se encontró el componente parametrizado del servidor de imagenes'
          );
        },
      });
  }

  getUserLevel() {
    return this.indUserService.getMinIndUser(this.authUser, 2).pipe(
      catchError(error => {
        this.errorForm('No se encontró el nivel de usuario');
        return throwError(() => error);
      }),
      switchMap(indicator =>
        this.eventProgrammingService
          .valUserInd({
            user: this.authUser,
            indicator,
          })
          .pipe(
            catchError(error => {
              this.errorForm('No se encontró el nivel de usuario');
              return throwError(() => error);
            })
          )
      ),
      tap(({ level }) => {
        if (!level) {
          this.errorForm('No se encontró el nivel de usuario');
          return;
        }
        this.blkCtrl.userLevel = Number(level);
      })
    );
  }

  getIndReopen() {
    return of(1).pipe(
      tap(account => {
        this.blkCtrl.reopenInd = account > 0 ? 0 : 1;
      })
    );
    // return of(0)
  }

  // CU_AREA_E
  async getAreasE() {}
  // CU_AREA_R;
  async getAreasR() {
    return await lastValueFrom(
      this.proceedingDeliveryReceptionService
        .getByUserAndArea(this.authUser, 'RF')
        .pipe(
          catchError(error => {
            if (error.status < 500) {
              this.alert(
                'error',
                ' Error',
                'No existen tipos de evento para el usuario ' + this.authUser
              );
            }
            return throwError(() => error);
          }),
          tap(response => {
            const def = {
              area_tramite: 'OP',
              descripcion: 'Oficialía de partes',
            };
            this.eventTypes = new DefaultSelect(
              [response, def],
              response.count
            );
          })
        )
    );
  }

  getType() {
    const params = new FilterParams();
    params.addFilter('certificateType', this.global.paperworkArea);
    return lastValueFrom(
      this.indicatorParametersService.getAll(params.getParams()).pipe(
        catchError(() => of(null)),
        map(res => res.data[0].procedureArea.id)
      )
    );
  }

  async initForm() {
    this.originalType = this.global.paperworkArea;
    this.getInitialParameter();
    if (this.global.paperworkArea) {
      this.global.paperworkArea = await this.getType();
    }
    this.getUserLevel().subscribe();
    this.ctrlButtons.sendSise.hide();
    this.ctrlButtons.signOffice.hide();
    this.ctrlButtons.printOffice.hide();
    this.ctrlButtons.notificationDest.hide();

    const { typeEvent, prog, responsible } = this.registerControls;
    if (this.global.paperworkArea == 'RF') {
      this.ctrlButtons.closeProg.hide();

      if (this.global.proceedingNum == null) {
        this.blkCtrl.reopenInd = 1;
      } else {
        this.getIndReopen().subscribe();
      }
      await this.getAreasR();
    } else {
      this.ctrlButtons.closeProg.show();
      // TODO: LLenar los datos con la consulta de "CU_AREA_E"
    }

    typeEvent.setValue(this.global.paperworkArea);
    if (typeEvent.value == 'DS') {
      this.ctrlButtons.convPack.enable();
    }

    if (typeEvent.value == 'DN') {
      this.ctrlButtons.convPack.enable();
      this.ctrlButtons.deletePack.show();
      this.showPackNumCtrl = true;
    }
    const params = new FilterParams();
    if (this.global.proceedingNum) {
      const indicator = await this.getProceedingType();
      params.addFilter('typeProceedings', indicator.certificateType);
      params.addFilter('id', this.global.proceedingNum);
      await this.getProceeding(params);
    }

    if (typeEvent.value) {
      this.activeFields();
    }

    if (typeEvent.value == 'RF') {
      prog.setValue('R');
      // TODO: CAMBIAR EL NOMBRE DE LOS ENCABEZADOS
    } else {
      prog.setValue('E');
      // TODO: CAMBIAR EL NOMBRE DE LOS ENCABEZADOS
    }
    this.blkCtrl.cEvent = 0;
    this.blkCtrl.cQuantity = 0;
    this.blkCtrl.cSelAll = 0;

    if (
      this.proceeding.statusProceedings == 'CERRADO' ||
      this.proceeding.statusProceedings == 'CERRADA'
    ) {
      if (typeEvent.value == 'RF') {
        this.ctrlButtons.closeProg.show();
      }
      this.ctrlButtons.closeProg.setText('Abrir Programación');
    } else if (
      this.proceeding.statusProceedings == 'ABIERTO' ||
      this.proceeding.statusProceedings == 'ABIERTA'
    ) {
      this.ctrlButtons.closeProg.setText('Cerrar Programación');
    } else if (this.proceeding.statusProceedings == null) {
      this.ctrlButtons.closeProg.setText('Cerrar Programación');
      if (this.authUser.startsWith('TLP')) {
        responsible.setValue('TLP');
        this.proceeding.responsible = 'TLP';
      } else {
        this.proceeding.responsible = responsible.value;
      }
    }

    if (
      this.proceeding.statusProceedings == 'ABIERTO' ||
      this.proceeding.statusProceedings == 'ABIERTA'
    ) {
      this.global.noClosed = 1;
    } else {
      this.global.noClosed = 0;
    }
  }

  // PUP_ACTIVA_CAMPOS
  activeFields() {
    const { typeEvent } = this.registerControls;
    if (typeEvent.value == 'RF') {
      const FEC_APROBACION_X_ADMON = 'Inicio';
    } else if (typeEvent.value == 'DN') {
      const LOC_TRANSF = 'Dictamen Donación';
      const FEC_APROBACION_X_ADMON = 'Entrega';
    } else if (typeEvent.value == 'DV') {
      const LOC_TRANSF = 'Dictamen Devolución';
    } else if (typeEvent.value == 'CM') {
      const LOC_TRANSF = 'Dictamen Procedencia';
      const FEC_APROBACION_X_ADMON = 'Entrega';
    } else if (typeEvent.value == 'DS') {
      const LOC_TRANSF = 'Dictamen Destrucción';
      const FEC_APROBACION_X_ADMON = 'Entrega';
    }
  }

  async getProceeding(params: FilterParams) {
    return await lastValueFrom(
      this.proceedingDeliveryReceptionService.getAll(params.getParams()).pipe(
        tap(async res => {
          this.proceeding = res.data[0];
          const form = {
            captureDate: new Date(res.data[0].captureDate),
            keysProceedings: res.data[0].keysProceedings,
            responsible: res.data[0].responsible,
          };
          this.form.patchValue(form);
          const date = new Date(form.captureDate).toISOString();
          const d = date.slice(0, -1);
          this.registerControls.captureDate.setValue(new Date(d));
          await this.afterGetProceeding();

          const params = new FilterParams();
          this.params.next(params);
        })
      )
    );
  }

  async afterGetProceeding() {
    const { typeEvent } = this.registerControls;
    if (typeEvent.value == 'RF') {
      const count = (await this.getExpedientsCount()) ?? 0;
      console.log({ count });
      const options = ['CERRADA', 'CERRADO'];
      if (options.find(opt => opt == this.proceeding.statusProceedings)) {
        console.log('PROGRAMACION CERRADA');

        this.ctrlButtons.closeProg.show();
        this.ctrlButtons.closeProg.label = 'Abrir Programación';
        if (count > 0) {
          if (this.proceeding.receiveBy != '1') {
            this.ctrlButtons.sendSise.show();
          } else {
            this.ctrlButtons.sendSise.hide();
          }
        } else {
          this.ctrlButtons.sendSise.hide();
        }
      } else {
        this.ctrlButtons.closeProg.label = 'Cerrar Programación';
        if (count > 0) {
          this.ctrlButtons.closeProg.hide();
        } else {
          if (this.proceeding.statusProceedings) {
            this.ctrlButtons.closeProg.show();
          }
        }
      }
    }

    await this.generateCve();
  }

  checkAll() {
    const els = document.getElementsByClassName('ng2-smart-th select');
    const el = els[0];
    if (!el) {
      return;
    }
    el.innerHTML = `<input id="select-all-check" type="checkbox" checked="${this.allSelected}">`;

    const check = document.getElementById(
      'select-all-check'
    ) as HTMLInputElement;
    check.checked = this.allSelected;
    check.addEventListener('change', $event => {
      this.selectedProceedings = [];
      const detail = [...this.detail];
      this.detail = [];
      this.detail = detail;
      const target = $event.target as HTMLInputElement;
      this.allSelected = target.checked;
    });
  }

  getDetail(_params?: FilterParams) {
    const params = _params ?? new FilterParams();
    params.addFilter('numberProceedings', this.proceeding.id);
    this.loading = true;
    return this.eventProgrammingService
      .getGoodsIndicators(this.proceeding.id, params.getParams())
      .pipe(
        catchError(error => {
          this.loading = false;
          this.blkCtrl.goodQuantity = 0;
          this.detail = [];
          this.totalItems = 0;
          return throwError(() => error);
        }),
        tap(async res => {
          this.checkAll();
          this.totalItems = res.count;
          this.loading = false;
          const detail = res.data[0];
          this.blkCtrl.goodQuantity = res.data.length;
          this.afterGetDetail(detail);
          this.detail = res.data.map(detail => {
            if (
              detail.expedientnumber &&
              (this.proceeding.numFile == 2 || !this.proceeding.numFile)
            ) {
              this.proceeding.numFile = Number(detail.expedientnumber);
              this.udpateProceedingExpedient().subscribe();
            }
            const { typeEvent } = this.registerControls;
            let locTrans = '';
            if (typeEvent.value == 'RF') {
              if (this.blkProceeding.txtCrtSus1) {
                locTrans = detail.warehouselocation;
              } else {
                locTrans = detail.transferentcity;
              }
            } else {
              switch (typeEvent.value) {
                case 'DN':
                  locTrans = detail.donationcontractkey;
                  break;
                case 'DV':
                  locTrans = detail.devolutionproceedingkey;
                  break;
                case 'CM':
                  locTrans = detail.dictationkey;
                  break;
                case 'DS':
                  locTrans = detail.destructionproceedingkey;
                  break;
                default:
                  break;
              }
            }
            return { ...detail, locTrans };
          });
          if (
            this.detail[0]?.expedientnumber &&
            !this.registerControls.transference.value
          ) {
            console.log('no hay trans guardado');
            await this.transferClick();
            this.updateTransfer().subscribe();
          }
        })
      );
  }

  updateTransfer() {
    const formValue = this.form.getRawValue();
    const { numFile, keysProceedings, captureDate, responsible } = formValue;
    const data = {
      ...this.proceeding,
      numFile,
      keysProceedings,
      captureDate: new Date(
        format(captureDate, 'yyyy-MM-dd HH:mm:ss')
      ).getTime(),
      responsible,
    };
    delete data.elaborationDate;
    delete data.datePhysicalReception;
    delete data.dateElaborationReceipt;
    delete data.dateDeliveryGood;
    delete data.approvalDateXAdmon;
    delete data.closeDate;
    delete data.maxDate;
    delete data.dateCaptureHc;
    delete data.dateCloseHc;
    delete data.dateMaxHc;
    return this.proceedingDeliveryReceptionService.update(
      this.proceeding.id,
      data as any
    );
  }

  // PA_CALCULA_CANTIDADES
  calculateQuantities() {
    const { typeEvent } = this.registerControls;
    this.programmingGoodService
      .computeEntities(this.proceeding.id, typeEvent.value)
      .pipe(
        tap(() => {
          const params = new FilterParams();
          params.addFilter('minutesNumber', this.proceeding.id);
          return this.tmpContProgrammingService
            .computeEntities(params.getParams())
            .pipe(
              tap(response => {
                const count = response.data[0];
                if (count) {
                  const {
                    amountEstate,
                    recordsAmount,
                    amountfiles,
                    amountOpinions,
                  } = count;
                  this.blkQuantities.goods = Number(amountEstate);
                  this.blkQuantities.registers = Number(recordsAmount);
                  this.blkQuantities.expedients = Number(amountfiles);
                  this.blkQuantities.dictums = Number(amountOpinions);
                }
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  // DETALLE_ACTA_ENT_RECEP.POST_QUERY
  afterGetDetail(detail: IGoodIndicator) {
    const { typeEvent } = this.registerControls;
    this.blkCtrl.typeNum = detail.typegood;
    this.blkCtrl.typeNumCant = this.blkCtrl.typeNumCant ?? 0;
    if (typeEvent.value == 'RF' && detail.status == 'CPR') {
      (this.settings.columns as any).status.title = 'VA_CPR';
    }

    if (
      !this.blkProceeding.txtCrtSus1 &&
      detail.inventorysiabi?.split('-').length >= 3
    ) {
      this.blkProceeding.txtCrtSus1 = detail.inventorysiabi.split('-')[0];
      const firstDashIndex = detail.inventorysiabi.indexOf('-');
      const secondDashIndex = detail.inventorysiabi.indexOf(
        '-',
        firstDashIndex + 1
      );

      if (firstDashIndex !== -1 && secondDashIndex !== -1) {
        this.blkProceeding.txtCrtSus2 = detail.inventorysiabi.substring(
          firstDashIndex + 1,
          secondDashIndex
        );
      }

      this.blkProceeding.txtCrtSus2 =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(
          this.blkProceeding.txtCrtSus2.substring(0, 1)
        ) === -1
          ? '%'
          : (this.blkProceeding.txtCrtSus1 = '%');

      if (typeEvent.value == 'RF') {
        this.blkCtrl.txtDirSatLabel = 'Dirección';
        (this.settings.columns as any).locTrans.title = 'Almacén';
        this.blkCtrl.txtDirSat = detail.txt_dirsat;
      }
    }

    this.calculateQuantities();
    // TODO: PEDIR TODOS LOS CAMPOS DEL DETALLE
    // this.blkCtrl.cQuantity = (this.blkCtrl.cQuantity?? 0) + this.
    console.log(
      this.detail[0]?.expedientnumber,
      this.registerControls.transference.value
    );
  }

  patchProceedingValue(proceeding: IProceedings) {}

  async getProceedingType() {
    const { typeEvent } = this.registerControls;
    const params = new FilterParams();
    params.addFilter('procedureArea', typeEvent.value);
    return await lastValueFrom(
      this.indicatorParametersService.getAll(params.getParams()).pipe(
        catchError(error => {
          this.alert('error', 'Error', 'No se localizo el tipo de acta');
          return throwError(() => error);
        }),

        map(response => response.data[0])
      )
    );
  }

  async getExpedientsCount() {
    const params = new FilterParams();
    params.addFilter('expedient', this.proceeding.numFile);
    params.addFilter('typeManagement', 2);
    return await lastValueFrom(
      this.procedureManagementService.getAllFiltered(params.getParams()).pipe(
        catchError(() => of({ count: 0 })),
        map(res => res.count)
      )
    );
  }

  onSubmit() {}

  onSubmit2() {}

  search() {}

  errorForm(message?: string) {
    if (message) {
      this.alert('error', 'Error', message);
    }
    // this.router.navigate([HOME_DEFAULT]);
  }

  async notificationBtn() {
    let n_cont;
    let c_mail;
    let l_ban;
    let c_user;
    let v_usuariotlp: number = 0;
    let v_usuarioost: number = 0;

    const user = this.authService.decodeToken().name.toUpperCase();

    v_usuariotlp = user.indexOf('TLP');
    v_usuarioost = user.indexOf('OST');

    const STATUS = ['CERRADO', 'CERRADA'];

    if (
      !STATUS.includes(this.proceeding.statusProceedings) &&
      this.global.paperworkArea == 'RF' &&
      this.proceeding.numFile &&
      v_usuarioost == -1 &&
      v_usuariotlp == -1
    ) {
      const count = await new Promise<number>((resolve, reject) => {
        const filters = new FilterParams();
        filters.addFilter(
          'flierNumber',
          this.proceeding.numFile,
          SearchFilter.EQ
        );
        filters.addFilter('typeManagement', 2, SearchFilter.EQ);

        this.procudeServ.getAllFiltered(filters.getParams()).subscribe({
          next: resp => {
            resolve(resp.count);
          },
          error: () => {
            resolve(0);
          },
        });
      });

      if (count == 0) {
        this.emailInser();
      }
    } else if (v_usuarioost != -1 || v_usuariotlp != -1) {
      this.alert(
        'info',
        'Usuario TLP y OST, no puede cargar los correos de envió de convocatoria a SISE.',
        ''
      );
    }
  }

  async emailInser() {
    let c_mail: string;
    let l_ban: boolean;
    let c_user: string;

    const { user, mail } = await new Promise<any>((resolve, reject) => {
      const user = this.authService.decodeToken().name.toUpperCase();
      const filters = new FilterParams();
      filters.addFilter(
        'user',
        'ZLB11_130' /*this.proceeding.numFile*/,
        SearchFilter.EQ
      );

      this.security.getAllUsersTracker(filters.getParams()).subscribe({
        next: resp => {
          const user = resp.data[0].user;
          const mail = resp.data[0].mail;
          resolve({ user, mail });
        },
        error: () => {
          resolve({ user: '', mail: 'X' });
        },
      });
    });

    c_mail = mail;

    if (c_mail != 'X') {
      l_ban = true;
    }
  }

  async closeProg() {
    this.PUP_MOVIMINETO_PRO();
  }

  dateNow2Day(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    return currentDate;
  }

  openMinutesProyect(model: IPAAbrirActasPrograma) {
    return new Promise((res, rej) => {
      this.progammingServ.paOpenProceedingProgam(model).subscribe({
        next: resp => {
          res(resp);
        },
        error: (err: HttpErrorResponse) => {
          res(err);
        },
      });
    });
  }

  async PA_CAMBIO_ESTATUS_BIEN(model: IPACambioStatusGood) {
    return new Promise((res, rej) => {
      this.progammingServ.paChangeStatusGood(model).subscribe({
        next: resp => res(resp),
        error: error => rej(error),
      });
    });
  }

  returPreviosStatus(model: IPAAbrirActasPrograma) {
    return new Promise((res, _rej) => {
      this.progammingServ.paRegresaEstAnterior(model).subscribe({
        next: resp => res(resp),
        error: error => res(error.error),
      });
    });
  }

  async tmpProgValidacion() {
    const filter = new FilterParams();
    const user =
      localStorage.getItem('username') == 'sigebiadmon'
        ? localStorage.getItem('username')
        : localStorage.getItem('username').toLocaleUpperCase();
    filter.addFilter('valUser', user, SearchFilter.EQ);
    filter.addFilter('valMinutesNumber', this.proceeding.id, SearchFilter.EQ);
    return new Promise<ITmpProgValidation[]>((resolve, reject) => {
      this.progammingServ.getTmpProgValidation(filter.getParams()).subscribe({
        next: resp => {
          console.info(resp.data);
          resolve(resp.data);
        },
        error: (error: HttpErrorResponse) => {
          const err: ITmpProgValidation[] = [
            {
              valmovement: 0,
              valMessage: error.error.message,
              valMinutesNumber: 0,
              valUser: '',
            },
          ];
          resolve(err);
        },
      });
    });
  }

  async PUP_MOVIMINETO_PRO() {
    let LV_VALMOTOS: number;
    let LV_VALMENSA: string;
    const LV_PANTALLA: string = 'FINDICA_0035_1';
    let v_COUNT: number = 0;
    let c_STR: string;
    let c_MENSAJE: string = null;
    let n_FOLIO_UNIVERSAL: number;
    let n_CONT: number = 0;
    let C_DATVAL: any;

    console.log('Bienes ...', this.detail);

    if (this.detail.length <= 0) {
      this.alert('info', 'No se tienen bienes ingresados.', '');
      return;
    }

    if (this.global.paperworkArea === 'RF') {
      n_CONT = (await this.getExpedientsCount()) ?? 0;
    }

    if (['CERRADO', 'CERRADA'].includes(this.proceeding.statusProceedings)) {
      if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 2);
        const FEC_APROBACION_X_ADMON = new Date(
          this.proceeding.approvalDateXAdmon
        );
        if (currentDate >= FEC_APROBACION_X_ADMON) {
          this.alert(
            'info',
            'La programación no puede abrirse hasta 2 días antes del evento.',
            ''
          );
          return;
        }
      }
      const response = await this.alertQuestion(
        'warning',
        'Abrir programación',
        `¿Está seguro de abrir la Programación ${this.proceeding.keysProceedings} ?`
      );
      if (response.isConfirmed) {
        await this.openProg(C_DATVAL, n_CONT);
      }
    } else {
      const C_DATVAL: any = await this.tmpProgValidacion();
      if (C_DATVAL[0].valmovement === null) {
        C_DATVAL[0].valmovement = 0;
      }
      if (C_DATVAL[0].valmovement === '1' || C_DATVAL[0].valmovement === 1) {
        await this.valMotodIsOne(n_CONT).then().catch();
      } else if (
        C_DATVAL[0].valmovement === '0' ||
        C_DATVAL[0].valmovement === 0
      ) {
        ///////// Llamar a la funcion PUP_CIERRE_PRI
        await this.PUP_CIERRE_PRI();
      }
    }
  }

  async valMotodIsOne(n_CONT: number) {
    if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
      const v_COUNT = (await this.getVCount()) ?? 0;
      if (v_COUNT === 0) {
        this.alert(
          'info',
          'No se ha firmado el oficio de programación de entrega.',
          ''
        );
        return;
      }
    }

    if (this.proceeding.typeProceedings === 'EVENCOMER') {
      const message: string = await this.PUF_VERIF_COMER(this.proceeding.id);
      console.log('Noooooooooooooooooooooooooooooo');

      if (message !== 'OK') {
        this.onLoadToast('error', message);
        return;
      }
    }

    const model: IPACambioStatusGood = {
      P_NOACTA: Number(this.proceeding.id),
      P_AREATRA: this.registerControls.typeEvent.value,
      P_PANTALLA: 'FINDICA_0035_1',
    };

    await this.PA_CAMBIO_ESTATUS_BIEN(model);
    await this.PA_ACTUALIZA_BIENES_SIN_M(this.proceeding.id);

    if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
      await this.PUP_ING_REG_FOLIO_UNIV_SSF3(
        this.proceeding.numFile,
        `OFICIO DE PROGRAMACION: ${this.proceeding.keysProceedings}`,
        null,
        'ENTRE'
      );
      ///// y hace este update c_STR := 'UPDATE ACTAS_ENTREGA_RECEPCION SET FOLIO_UNIVERSAL = '||TO_CHAR(n_FOLIO_UNIVERSAL)||', TESTIGO1 ='''||:BLK_TOOLBAR.TOOLBAR_USUARIO||''' WHERE NO_ACTA = '||TO_CHAR(:ACTAS_ENTREGA_RECEPCION.NO_ACTA);
      await this.UPDATE_ACTAS_ENTREGA_RECEPCION(
        this.proceeding.universalFolio,
        localStorage.getItem('username') == 'sigebiadmon'
          ? localStorage.getItem('username')
          : localStorage.getItem('username').toLocaleUpperCase(),
        this.proceeding.id
      );
    }

    if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
      const no_Acta: number | string = this.proceeding.id; //// :ACTAS_ENTREGA_RECEPCION.NO_ACTA
      // await this.INSERT_ACTAS_CTL_NOTIF_SSF3(no_Acta, 'CERRADA');
      /// AQUI HACER ESA ACTUALIZACION UPDATE_SSF3_ACTAS_PROG_DST Esperando enpoint
      //c_STR UPDATE SSF3_ACTAS_PROG_DST SET IND_ENVIO = 0 WHERE NO_ACTA = ||TO_CHAR(:ACTAS_ENTREGA_RECEPCION.NO_ACTA);
      await this.UPDATE_SSF3_ACTAS_PROG_DST(null);
      this.alert(
        'info',
        `Se realizó la firma y cierre del oficio (Folio Universal: ${this.proceeding.universalFolio})`,
        ''
      );
      // await this.PUP_GENERA_PDF();
    } else {
      this.global.paperworkArea = this.originalType;
      await this.initForm();
      this.alert('success', 'La programación ha sido cerrada', '');
    }
  }

  async PUF_VERIF_COMER(numberAct: number | string): Promise<string> {
    const model = {
      pcActNo: Number(numberAct),
    };
    return new Promise<string>((res, rej) => {
      this.massiveGoodService.pufVerificaComers(model).subscribe({
        next: resp => {
          res('OK');
        },
        error: err => rej('Error'),
      });
    });
  }

  async INSERT_ACTAS_CTL_NOTIF_SSF3(
    ActaNumber: number | string,
    statusAct: string
  ) {
    ////// hacer un insert a esta tabla
    const postActsCtl: any = {
      NO_ACTA: ActaNumber,
      FEC_MOV: new Date(),
      ESTATUS_ACTA: statusAct,
      IND_NOTIF: '1',
    };
    return new Promise((res, rej) => {
      this.progammingServ.createActasCtlNotifSSF3(postActsCtl).subscribe({
        next: resp => res(resp),
        error: err => rej(err),
      });
    });
  }

  async PUP_GENERA_PDF() {
    let REPID: any;
    let v_REP: string;
    let v_URL: string;
    let v_ARCHOSAL: string;
    let v_NOMBRE: string;
    let v_RUTA: string;
    let v_COUNT: number;
    let c_STR: string;

    try {
      // OBTIENE INFORMACIÓN DE RUTA Y URL
      /* SELECT VALOR_FINAL, VALOR_INICIAL INTO v_RUTA, v_URL
      FROM PARAMETROS
      WHERE CVE_PARAMETRO ='SSF3_FIRMA_ELEC_DOCS'; */
      const response: any = await this.GET_RUTA_URL_PARAMETER(
        'SSF3_FIRMA_ELEC_DOCS'
      );
      v_RUTA = response.finalValue;
      v_URL = response.initialValue;
    } catch {
      this.alert('info', 'No se encontró la ruta y URL para el PDF.', '');
      throw new Error('FORM_TRIGGER_FAILURE');
    }
    v_NOMBRE = this.proceeding.keysProceedings.replace('/', '-');
    v_ARCHOSAL = v_RUTA + v_NOMBRE + '.PDF';
    /* >> JACG 30/06/15 Ingresa PDF a BD */
    this.PUP_ELIMINA_PDF_BD_SSF3(this.proceeding.universalFolio, 1);
    this.PUP_CARGA_PDF_BD_SSF3(this.proceeding.universalFolio, 1, v_ARCHOSAL);
    /* << JACG 30/06/15 Ingresa PDF a BD */
  }

  GET_RUTA_URL_PARAMETER(cveParameter: string) {
    const response = {
      finalValue: 0,
      initialValue: 0,
    };
    return new Promise((res, rej) => {
      this.parameterGoodService.getById(cveParameter).subscribe({
        next: resp => {
          response.finalValue = resp.data[0].finalValue;
          response.initialValue = resp.data[0].initialValue;
          res(response);
        },
        error: err => rej(response),
      });
    });
  }

  PUP_ELIMINA_PDF_BD_SSF3(p_LLAVE: string, p_NO_ARCHO: number) {}

  PUP_CARGA_PDF_BD_SSF3(p_LLAVE: string, p_NO_ARCHO: number, p_RUTA: string) {}

  async PUP_ING_REG_FOLIO_UNIV_SSF3(
    p_NO_EXPEDIENTE: number,
    p_DESCRIPCION_DOCUMENTO: string,
    p_NO_VOLANTE: number,
    p_CVE_TIPO_DOCUMENTO: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // Definición de variables
      let c_NO_VOLANTE: string;
      // Cuerpo del procedimiento
      let n_NO_EXPEDIENTE = p_NO_EXPEDIENTE;
      let c_DESCRIPCION_DOCUMENTO = p_DESCRIPCION_DOCUMENTO;
      if (p_NO_VOLANTE === null) {
        c_NO_VOLANTE = 'NULL';
      } else {
        c_NO_VOLANTE = p_NO_VOLANTE.toString();
      }
      let c_CVE_TIPO_DOCUMENTO = p_CVE_TIPO_DOCUMENTO;
      const postDocument: IDocuments = {
        numberProceedings: n_NO_EXPEDIENTE,
        keySeparator: '60',
        keyTypeDocument: c_CVE_TIPO_DOCUMENTO,
        natureDocument: 'ORIGINAL',
        descriptionDocument: c_DESCRIPCION_DOCUMENTO,
        significantDate: this.getFormattedDate(),
        scanStatus: 'ESCANEADO',
        userRequestsScan: 'user',
        scanRequestDate: new Date(),
        numberDelegationRequested: 2,
        numberDepartmentRequest: 2,
        numberSubdelegationRequests: 2,
        flyerNumber: c_NO_VOLANTE,
        mediumId: '-1',
        sheets: '1',
        dateRegistrationScan: new Date(),
        userRegistersScan: 'user',
      };
      this.documentsService.create(postDocument).subscribe({
        next: resp => {
          const postHistory: IHistoryProcesdingAct = {
            dateMov: new Date(),
            invoiceUniversal: resp.id,
            minutesNumber: Number(this.proceeding.id), /// Aqui va el :ACTAS_ENTREGA_RECEPCION.NO_ACTA)
          };
          this.progammingServ
            .createHistoryProcedingAct(postHistory)
            .subscribe();
        },
        error: err => console.error(err),
      });
      const p_FOLIO_UNIVERSAL: string = '0';
      resolve(p_FOLIO_UNIVERSAL);
    });
  }

  getFormattedDate(): string {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Agrega un cero al mes si es necesario
    const year = String(currentDate.getFullYear());
    return `${month}-${year}`;
  }
  async UPDATE_SSF3_ACTAS_PROG_DST(no_Acta: string | number) {
    const model = {
      minutesNumber: no_Acta,
    };
    return new Promise((res, rej) => {
      this.eventProgrammingService.putSsf3(model).subscribe({
        next: resp => res(resp),
        error: error => rej(error),
      });
    });
  }

  async PA_ACTUALIZA_BIENES_SIN_M(actaNumber: number | string) {
    return new Promise((res, rej) => {
      this.progammingServ.updateGoodSim(Number(actaNumber)).subscribe({
        next: resp => res(resp),
        error: error => rej(error),
      });
    });
  }

  async getVCount() {
    const params = new FilterParams();
    params.addFilter('expedient', this.proceeding.numFile);
    params.addFilter('typeManagement', 2);
    return await lastValueFrom(
      this.procedureManagementService.getAllFiltered(params.getParams()).pipe(
        catchError(() => of({ count: 0 })),
        map(res => res.count)
      )
    );
  }

  async openProg(C_DATVAL: any, n_CONT: number) {
    const model: IPAAbrirActasPrograma = {
      P_NOACTA: Number(this.proceeding.id),
      P_TIPOMOV: 1,
      P_AREATRA: `${this.registerControls.typeEvent.value}`,
      P_PANTALLA: 'FINDICA_0035_1',
      USUARIO:
        localStorage.getItem('username') == 'sigebiadmon'
          ? localStorage.getItem('username')
          : localStorage.getItem('username').toLocaleUpperCase(),
    };
    console.log(model);
    const response: any = await this.openMinutesProyect(model);
    console.log('Este es el response que necesito', response);
    if (response.statusCode !== 200) {
      console.log(response.error.message);
      this.alert(
        'error',
        'Ha ocurrido un error',
        response.error.message
          ? response.error.message
          : 'No se ha podido abrir la programación'
      );
      return;
    }
    const C_DATVAL1: any = await this.tmpProgValidacion();
    /////////////////////////////////////
    if (C_DATVAL1[0].valmovement === '1' || C_DATVAL1[0].valmovement === 1) {
      const model: IPAAbrirActasPrograma = {
        P_NOACTA: Number(this.proceeding.id),
        P_AREATRA: this.registerControls.typeEvent.value,
        P_PANTALLA: 'FINDICA_0035_1',
        P_TIPOMOV: 1,
        USUARIO:
          localStorage.getItem('username') == 'sigebiadmon'
            ? localStorage.getItem('username')
            : localStorage.getItem('username').toLocaleUpperCase(),
      };
      await this.returPreviosStatus(model);
      //////////////////////////////// aqui va el endpoint esperado por EDWIN
      await this.insertsAndUpdate(this.proceeding.id);
      ////////////////////////////////////////
      if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
        ///////////// Hacer inset a esta tabla ACTAS_CTL_NOTIF_SSF3
        const no_Acta: number | string = this.proceeding.id; /// :ACTAS_ENTREGA_RECEPCION.NO_ACTA
        //  await this.INSERT_ACTAS_CTL_NOTIF_SSF3(no_Acta, 'ABIERTA');
      }
      this.blkCtrl.reopenInd = 0;
      this.global.paperworkArea = this.originalType;
      await this.initForm();
      this.alert('success', 'La programación ha sido abierta', '');
    } else {
      this.global.paperworkArea = this.originalType;
      await this.initForm();
      this.alert('info', C_DATVAL1[0].valMessage, '');
    }
  }

  insertsAndUpdate(actNumber: string | number) {
    const model = {
      actNumber,
    };
    return new Promise((res, _rej) => {
      this.eventProgrammingService.massiveDeleteAndUpdate(model).subscribe({
        next: resp => res(resp.message),
        error: err => res(err.error.message),
      });
    });
  }

  getEstatusAct() {
    return new Promise<string>((res, rej) => {
      const params: _Params = {};
      params['filter.id'] = `$eq:${this.proceeding.id}`;
      this.proceedingDeliveryReceptionService.getAll(params).subscribe({
        next: resp => res(resp.data[0].statusProceedings),
        error: err => rej('Error'),
      });
    });
  }
  PUF_VERIFICA_CLAVE(): boolean {
    return this.form.get('keysProceedings').value.includes('//');
  }

  PUP_DEPURA_DETALLE() {
    this.detail = this.detail.filter(
      good => !this.selectedProceedings.includes(good)
    );
  }

  async PUP_CIERRE_PRI() {
    let lv_VALFECP: number;
    let v_COUNT: number;
    let n_CONT: number = 0;
    let c_MENSAJE: string;
    try {
      // Valida que la llave de la programación no sea nula ni el tipo de acta (valida 3)
      if (
        this.proceeding.id === null &&
        this.proceeding.typeProceedings === null
      ) {
        this.alert('info', 'Información', 'No se tiene Programa a cerrar.', '');
        return;
      }

      // Area de Tramite no puede ser nula para cerrar una programación (valida 1)
      if (this.form.get('typeEvent').value === null) {
        this.alert(
          'info',
          'Información',
          'No se ha especificado el Tipo de Evento.',
          ''
        );
        return;
      }

      // Valida que la clave de la programación este completa (valida 2)
      if (this.PUF_VERIFICA_CLAVE()) {
        this.alert(
          'error',
          'El Programa es inconsistente en su estructura.',
          'Valide que la Cve. del Acta este correcta'
        );
        return;
      }
      if (this.detail[0].goodnumber === null) {
        this.alert(
          'error',
          'No se pudo realizar la actualización de bienes.',
          'Revise que los bienes sean los correctos'
        );
        return;
      } else {
        lv_VALFECP = 0;
        for (const element of this.detail) {
          const deta: any = element;
          if (
            deta.dateindicatesuserapproval == null ||
            deta.dateapprovalxadmon == null
          ) {
            lv_VALFECP = lv_VALFECP + 1;
            break;
          }
        }
        if (lv_VALFECP === 0) {
          if (this.global.paperworkArea === 'RF') {
            n_CONT = (await this.getExpedientsCount()) ?? 0;
          }
          if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
            //// VALIDA SI EXISTE EL XML GENERADO
            v_COUNT = (await this.getVCount()) ?? 0;
            if (v_COUNT === 0) {
              this.alert(
                'error',
                'No se ha firmado el oficio de programación de entrega.',
                ''
              );
              return;
            }
          }
          if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
            await this.closedProgramming(n_CONT);
          } else {
            const response = await this.alertQuestion(
              'question',
              'Cerrar programación',
              '¿Seguro que desea realizar el cierre de esta Programación ?'
            );
            if (response.isConfirmed) {
              await this.closedProgramming(n_CONT);
            }
          }
        } else {
          this.global.paperworkArea = this.originalType;
          await this.initForm();
          this.alert(
            'error',
            'Ha ocurrido un error',
            'Falta complementar Fechas de Recepción/Entrega y/o Finalización de los bienes'
          );
        }
      }
    } catch (e_EXCEPPROC) {
      c_MENSAJE = 'Ocurrió un error inesperado';
      this.alert('error', 'Ha ocurrido un error', c_MENSAJE);
    }
  }

  PA_CIERRE_INICIAL_PROGR(
    no_Acta: string | number,
    lv_PANTALLA: string,
    blkCtrlArea: string | number
  ) {
    return new Promise((res, rej) => {
      this.programmingGoodService
        .PaCierreInicialProgr(no_Acta, lv_PANTALLA, blkCtrlArea)
        .subscribe({
          next: resp => {
            console.log(resp.message[0]);
            res(resp.message[0]);
          },
          error: err => res('Error'),
        });
    });
  }

  async closedProgramming(n_CONT: number) {
    if (this.proceeding.typeProceedings === 'EVENCOMER') {
      const message: string = await this.PUF_VERIF_COMER(this.proceeding.id);
      if (message !== 'OK') {
        return;
      }
    }
    await this.PA_CIERRE_INICIAL_PROGR(
      this.proceeding.id,
      'FINDICA_0035_1',
      this.registerControls.typeEvent.value
    );
    const T_VALEACT: string = await this.getEstatusAct();
    if (['ABIERTO', 'ABIERTA'].includes(T_VALEACT)) {
      this.global.paperworkArea = this.originalType;
      await this.initForm();
      this.alert(
        'error',
        'Ha ocurrido un error',
        'La Programación no ha sido cerrada, probableamente los bienes no tienen un estatus válido'
      );
    } else {
      if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
        await this.PUP_ING_REG_FOLIO_UNIV_SSF3(
          this.proceeding.numFile,
          `OFICIO DE PROGRAMACION: ${this.proceeding.keysProceedings}`,
          null,
          'ENTRE'
        );
        //// aqui hace los DDL
        await this.firmaAndClosedOffi();
        ///////////////////////////////////////
        this.global.paperworkArea = this.originalType;
        await this.initForm();
        this.alert(
          'success',
          `Se realizó la firma y cierre del oficio (Folio Universal: ${this.proceeding.universalFolio})`,
          ''
        );
      } else {
        this.global.paperworkArea = this.originalType;
        await this.initForm();
        this.alert('success', 'La programación ha sido cerrada', '');
      }
      const parameterNoFormat: any = null;
      if (parameterNoFormat !== null) {
        this.UPDATE_ESTRATEGIA_BIENES(parameterNoFormat, this.proceeding.id);
      }
    }
  }

  async firmaAndClosedOffi() {
    const respAct = await this.UPDATE_ACTAS_ENTREGA_RECEPCION(
      this.proceeding.universalFolio,
      this.authUserName,
      this.proceeding.id
    );
    /* const respActCtr = await this.INSERT_ACTAS_CTL_NOTIF_SSF3(
      this.proceeding.id,
      'CERRADA'
    ); */
    const respActProg = await this.UPDATE_SSF3_ACTAS_PROG_DST(null);
  }

  UPDATE_ACTAS_ENTREGA_RECEPCION(
    universalFolio: string,
    userToolbar: string,
    no_Acta: string | number
  ) {
    const model: IUpdateActasEntregaRecepcion = {
      universalFolio,
      userToolbar,
    };
    return new Promise<string>((res, rej) => {
      this.proceedingsService
        .updateActasEntregaRecepcion(model, no_Acta)
        .subscribe({
          next: (resp: any) => res(resp.message),
          error: err => rej(err),
        });
    });
  }

  UPDATE_ESTRATEGIA_BIENES(noFormat: number, no_Acta: string | number) {
    const model = {
      minutesNumber: no_Acta,
    };
    this.goodPosessionThirdpartyService
      .updateThirdPartyAdmonXFormatNumber(noFormat, model)
      .subscribe();
  }

  async paqConv() {
    let v_ind_proc: boolean;
    let V_TIPO_ACTA: string | number;
    let lv_PAQWHERE: string;

    if (
      this.proceeding.typeProceedings === 'CERRADO' ||
      this.proceeding.statusProceedings === 'CERRADA'
    ) {
      this.alert('error', 'Error', 'El Programa está cerrado');
      return;
    }

    if (this.registerControls.typeEvent.value === null) {
      this.alert('error', 'Error', 'No se ha especificado el Tipo de Evento');
      return;
    }

    V_TIPO_ACTA = await this.getParameterGood(
      this.registerControls.typeEvent.value
    );

    if (V_TIPO_ACTA === null) {
      this.alert('error', 'Error', 'No se localizó el Tipo de Acta');
      return;
    }

    if (this.proceeding.keysProceedings === null) {
      this.alert('error', 'Error', 'No se ha ingresado el Programa');
      return;
    }

    v_ind_proc = false;

    if (this.detail.length > 0) {
      await this.alertQuestion(
        'question',
        'La asignación de bienes ya se ha realizado',
        '¿Se ejecuta nuevamente?'
      ).then(question => {
        if (question.isConfirmed) {
          v_ind_proc = true;
        }
      });
    } else {
      await this.alertQuestion(
        'question',
        '¿Quiere continuar con la selección?',
        ''
      ).then(question => {
        if (question.isConfirmed) {
          v_ind_proc = true;
        }
      });
    }

    if (v_ind_proc) {
      if (this.registerControls.typeEvent.value === 'DS') {
        lv_PAQWHERE =
          "ESTATUS_PAQ = 'C' AND TIPO_PAQUETE = 1 AND ESTATUS IN (SELECT ESTATUS FROM ESTATUS_X_PANTALLA WHERE CVE_PANTALLA = 'FINDICA_0035_1' AND ACCION = 'DS')";
      } else if (this.registerControls.typeEvent.value === 'DN') {
        lv_PAQWHERE =
          "ESTATUS_PAQ = 'C' AND TIPO_PAQUETE = 2 AND ESTATUS IN (SELECT ESTATUS FROM ESTATUS_X_PANTALLA WHERE CVE_PANTALLA = 'FINDICA_0035_1' AND ACCION = 'DN')";
      }
    }
  }

  getParameterGood(procedureArea: string | number) {
    const params: ListParams = {};
    params['filter.procedureAreaDetails.id=$eq:'] = procedureArea;

    return new Promise<string | number>((res, rej) => {
      this.parameterGoodService.getIndicatorParameter().subscribe({
        next: resp => res(resp.data[0].certificateType),
        error: _err => rej('Error'),
      });
    });
  }

  async signOffice() {
    let n_CONT: number;
    let l_BAN: boolean;
    let l_BAS: boolean;
    let V_USUARIOTLP: number;
    let V_USUARIOOST: number;

    V_USUARIOTLP = this.authUserName.indexOf('TLP');
    V_USUARIOOST = this.authUserName.indexOf('OST');

    if (
      ['CERRADO', 'CERRADA'].includes(this.proceeding.statusProceedings) &&
      this.proceeding.typeProceedings === 'EVENTREC' &&
      this.proceeding.id !== null &&
      this.proceeding.numFile !== null &&
      V_USUARIOTLP === 0 &&
      V_USUARIOOST === 0
    ) {
      n_CONT = (await this.getExpedientsCount()) ?? 0;
      if (n_CONT > 0) {
        const SSF3_ACTAS_PROG_DST = {
          EMAIL: '',
          TIPO_DEST: '',
        };
        if (SSF3_ACTAS_PROG_DST.EMAIL === null) {
          this.alert(
            'error',
            'Error',
            'No se cuenta con Lista de Distribución de correo'
          );
          this.PUP_ING_CORREO_SAE();
          return;
        }
        l_BAN = true;
        l_BAS = true;
        /*         while (SYSTEM.LAST_RECORD !== 'TRUE') {
          if (SSF3_ACTAS_PROG_DST.TIPO_DEST === 'SAT') {
            l_BAN = false;
          }
          if (SSF3_ACTAS_PROG_DST.TIPO_DEST === 'SAE') {
            l_BAS = false;
          }
          NEXT_RECORD();
        }
        FIRST_RECORD(); */
        if (l_BAN) {
          this.alert(
            'info',
            'No se cuenta con Distribución de correo al SAT.',
            ''
          );
          return;
        }
        if (l_BAS) {
          this.alert(
            'info',
            'No se cuenta con Distribución de correo al SAE.',
            ''
          );
          return;
        }
      }

      if (this.detail[0].goodnumber === null) {
        this.alert('info', 'No se tienen bienes relacionados', '');
        return;
      } else if (this.detail[0].dateapprovalxadmon === null) {
        this.alert('info', 'No se cuenta con Fecha de inicio de acto.', '');
        return;
      } else if (this.detail[0].dateindicatesuserapproval === null) {
        this.alert(
          'info',
          'No se cuenta con Fecha de finalización de acto.',
          ''
        );
        return;
      }
      if (this.registerControls.typeEvent.value === null) {
        this.alert(
          'info',
          'Información',
          'No se ha especificado el Tipo de Evento.',
          ''
        );
        return;
      }
      if (this.PUF_VERIFICA_CLAVE()) {
        this.alert(
          'info',
          'Información',
          'El Programa es inconsistente en su estructura, verifique que la Cve. de Acta sea correcto'
        );
        return;
      }
      this.PUP_GENERA_XML();
    } else if (V_USUARIOTLP === 1 || V_USUARIOOST === 1) {
      this.alert(
        'info',
        'Usuario TLP y OST no pueden realizar el cierre de Programaciones.',
        ''
      );
    } else {
      this.alert('info', 'Inválido para firma de Oficio', '');
    }
  }

  PUP_ING_CORREO_SAE() {}
  PUP_GENERA_XML() {}
}
