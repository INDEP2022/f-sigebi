import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, firstValueFrom, map, of, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IPhotos } from 'src/app/core/models/catalogs/photograph-media.model';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IComerEvent } from 'src/app/core/models/ms-event/event.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import {
  IAttribGoodBad,
  ICharacteristicsGoodDTO,
  IGood,
} from 'src/app/core/models/ms-good/good';
import { IPhoto } from 'src/app/core/models/ms-parametercomer/parameter';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { AccountMovements } from 'src/app/core/services/ms-account-movements/account-movements.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { AttribGoodBadService } from 'src/app/core/services/ms-good/attrib-good-bad.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { GoodPartializeService } from 'src/app/core/services/ms-partialize/partialize.service';
import { GoodPhotoService } from 'src/app/core/services/ms-photogood/good-photo.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_POSITIVE_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { IParamsLegalOpinionsOffice } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/legal-opinions-office.component';
import { UploadFileComponent } from 'src/app/pages/request/shared-request/expedients-tabs/sub-tabs/photos-assets/upload-file/upload-file.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  firstFormatDate,
  firstFormatDateToSecondFormatDate,
  formatForIsoDate,
  secondFormatDate,
  thirdFormatDate,
} from 'src/app/shared/utils/date';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';
import { AllExpedientComponent } from '../all-expedient/all-expedient/all-expedient.component';
import { GoodsPhotoService } from '../services/image-debugging-service';
import { PHOTOGRAPHY_COLUMNS } from './image-debugging-columns';
@Component({
  selector: 'app-image-debugging',
  templateUrl: './image-debugging.component.html',
  styles: [],
})
export class ImageDebuggingComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  formLoading = false;
  goodPhoto: IPhoto[] = [];
  showConciliado = false;
  expedientSelected = new DefaultSelect();
  lotIdSelected = new DefaultSelect();
  eventIdSelected = new DefaultSelect();
  LVALIDA = true;
  showAvaluo = true;
  lot: any;
  event: IComerEvent;
  expedients: IExpedient[] = [];
  photographs: any[] = [];
  programming: Iprogramming;
  filterParams = new FilterParams();
  newLimit = new FormControl(1);
  totalItems = 0;
  goodDateTable: LocalDataSource = new LocalDataSource();
  totalItemsPhotos = 0;

  count = 0;
  noExpedient = 0;
  goods: any[];
  delegacion: number;
  subdelegacion: number;
  selectedBad: IAttribGoodBad;
  form: FormGroup;
  di_desc_est: string;
  disabledBienes: boolean = true;
  goodChange: number = 0;
  bodyGoodCharacteristics: ICharacteristicsGoodDTO = {};
  goodsAll: IGood[] = [];
  goodO: IGood = {};
  showPhoto = false;
  loadTypes = false;
  actualGoodNumber: number = null;
  errorMessage: string;
  get data() {
    return this.service.data;
  }

  set data(value) {
    this.service.data = value;
  }

  get good() {
    return this.service.good;
  }

  set good(value) {
    this.service.good = value;
  }

  get haveTdictaUser() {
    return this.service.haveTdictaUser;
  }

  set haveTdictaUser(value) {
    this.service.haveTdictaUser = value;
  }

  get disabledDescripcion() {
    return this.service.disabledDescripcion;
  }

  set disabledDescripcion(value) {
    this.service.disabledDescripcion = value;
  }

  get disabledNoClasifBien() {
    return this.service.disabledNoClasifBien;
  }

  set disabledNoClasifBien(value) {
    this.service.disabledNoClasifBien = value;
  }

  get disabledTable() {
    return this.service.disabledTable;
  }

  set disabledTable(value) {
    this.service.disabledTable = value;
  }

  get numberGood() {
    return this.form.get('noBien');
  }
  get fileNumber() {
    return this.form.get('fileNumber');
  }
  get idEvemt() {
    return this.form.get('idEvent');
  }
  get idLot() {
    return this.form.get('idLot');
  }
  get lotDesc() {
    return this.form.get('lotDesc');
  }
  get eventDesc() {
    return this.form.get('eventDesc');
  }
  get numberClassification() {
    return this.form.get('noClasif');
  }

  get goodStatus() {
    return this.form.get('status');
  }

  get goodUnit() {
    return this.form.get('unidad');
  }

  get goodQuantity() {
    return this.form.get('cantidad');
  }

  get goodReference() {
    return this.form.get('valRef');
  }

  get goodAppraisal() {
    return this.form.get('valorAval');
  }

  get goodDateVigency() {
    return this.form.get('fechaAval');
  }

  get goodLatitude() {
    return this.form.get('latitud');
  }

  get goodLongitude() {
    return this.form.get('longitud');
  }

  get goodObservations() {
    return this.form.get('observaciones');
  }

  get goodAppraisal2() {
    return this.form.get('avaluo');
  }

  get delegation() {
    return this.form.get('delegation');
  }

  get subdelegation() {
    return this.form.get('subdelegation');
  }

  get latitud() {
    return this.form.get('latitud');
  }

  get longitud() {
    return this.form.get('longitud');
  }

  get type() {
    return this.form.get('type');
  }

  get subtype() {
    return this.form.get('subtype');
  }

  get ssubtype() {
    return this.form.get('ssubtype');
  }

  get sssubtype() {
    return this.form.get('sssubtype');
  }

  get descripcion() {
    return this.form.get('descripcion');
  }

  get pathDelegation() {
    return 'catalog/api/v1/delegation/get-all?filter.etapaEdo:$eq:' + this.good;
  }

  get disabledDescripcion2() {
    if (this.disabledDescripcion) {
      return true;
    } else {
      if (this.disabledBienes) {
        return true;
      }
      return false;
    }
  }

  select = new DefaultSelect();

  screenKey: string = 'FACTDIRDATOSBIEN'; // Clave de la pantalla actual
  origin: string = null;
  origin1: string = ''; // Pantalla para regresar a la anterior de la que se llamo origin
  origin2: string = ''; // Pantalla para regresar a la anterior de la que se llamo desde la origin1
  origin3: string = ''; // Pantalla para regresar a la anterior de la que se llamo desde la origin2
  paramsScreenOffice: IParamsLegalOpinionsOffice = {
    PAQUETE: '',
    P_GEST_OK: '',
    CLAVE_OFICIO_ARMADA: '',
    P_NO_TRAMITE: '',
    TIPO: '',
    P_VALOR: '',
    TIPO_VO: '',
    NO_EXP: '',
    CONSULTA: '',
  };
  TIPO_PROC: string = '';
  NO_INDICADOR: string = '';
  di_numerario_conciliado: string;
  constructor(
    private sanitizer: DomSanitizer,
    private goodProcessService: GoodprocessService,
    private wcontentService: WContentService,
    private location: Location,
    private modalService: BsModalService,
    private goodService: GoodService,
    private serviceDeleg: DelegationService,
    private lotService: LotService,
    private subdelegationService: SubdelegationService,
    private georeferencieService: SurvillanceService,
    private statusScreenService: StatusXScreenService,
    private dictationService: DictationService,
    private activatedRoute: ActivatedRoute,
    private parameterService: ParameterCatService,
    private accountMovementsService: AccountMovements,
    private segxAccessService: SegAcessXAreasService,
    private service: GoodsPhotoService,
    private goodPartialize: GoodPartializeService,
    private comerDetailService: ComerDetailsService,
    private comerEventService: ComerEventService,
    private goodPhotoService: GoodPhotoService,
    private attribGoodBadService: AttribGoodBadService,
    private fb: FormBuilder,
    public router: Router
  ) {
    super();
    this.loading = true;
    this.params.value.limit = 1;
    this.settings = {
      ...this.settings,
      columns: PHOTOGRAPHY_COLUMNS,
      edit: {
        editButtonContent: '<i  class="fa fa-eye text-info mx-2" > Ver</i>',
      },
    };
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.count > 0) this.searchGood(true);
      this.count++;
    });
  }

  ngOnInit(): void {
    this.loading = false;
    this.prepareForm();
    this.activatedRoute.queryParams.subscribe({
      next: param => {
        this.origin = param['origin'] ?? null;
        this.origin1 = param['origin1'] ?? null;
        if (
          this.origin1 == 'FACTJURDICTAMOFICIO' &&
          this.origin == 'FATRIBREQUERIDO'
        ) {
          for (const key in this.paramsScreenOffice) {
            if (Object.prototype.hasOwnProperty.call(param, key)) {
              this.paramsScreenOffice[
                key as keyof typeof this.paramsScreenOffice
              ] = param[key] ?? null;
            }
          }
          this.origin2 = param['origin2'] ?? null;
          this.origin3 = param['origin3'] ?? null;
          this.TIPO_PROC = param['TIPO_PROC'] ?? null;
          this.NO_INDICADOR = param['NO_INDICADOR'] ?? null;
        }
        const selectedBadString = localStorage.getItem('selectedBad');
        const actualGoodNumberString = localStorage.getItem('goodNumberDepura');
        if (selectedBadString) {
          this.selectedBad = JSON.parse(selectedBadString);
          if (!this.origin) this.origin = '1';
          this.numberGood.setValue(this.selectedBad.id);
          this.searchGood();
          this.getImageGood();
        } else {
          if (actualGoodNumberString) {
            this.numberGood.setValue(actualGoodNumberString);
            this.searchGood();
            this.getImageGood();
          }
        }
      },
    });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const selectedBadString = localStorage.getItem('selectedBad');
    const actualGoodNumberString = localStorage.getItem('goodNumberDepura');
    if (selectedBadString || actualGoodNumberString) {
      if (selectedBadString) {
        setTimeout(() => {
          this.selectTab(0, 1);
          this.enabledFotos();
        }, 1000);
      }
    } else {
      setTimeout(() => {
        this.selectTab(1, 0);
        this.disabledFotos();
      }, 1000);
    }
  }

  selectTab(tabDisabled: 0 | 1, tabActive: 0 | 1) {
    // console.log(this.staticTabs);

    if (this.staticTabs?.tabs[tabActive]) {
      this.staticTabs.tabs[tabDisabled].disabled = true;
      this.staticTabs.tabs[tabActive].active = true;
    }
  }
  private setPaginate(value: any[]): any[] {
    let data: any[] = [];
    let dataActual: any = [];
    value.forEach((val, i) => {
      dataActual.push(val);
      if ((i + 1) % this.params.value.limit === 0) {
        this.data.push(dataActual);
        dataActual = [];
      } else if (i === value.length - 1) {
        this.data.push(dataActual);
      }
    });
    console.log(data);
    // data = this.data[this.params.value.page - 1];
    return data;
  }

  private disabledFotos() {
    if (this.staticTabs) {
      this.staticTabs.tabs[1].disabled = true;
    }
  }

  private enabledFotos() {
    if (this.staticTabs) {
      this.staticTabs.tabs[1].disabled = false;
    }
  }

  back() {
    this.location.back();
  }

  goToHistoric() {
    if (this.actualGoodNumber) {
      this.router.navigate(
        [`/pages/general-processes/historical-good-situation`],
        {
          queryParams: {
            noBien: this.actualGoodNumber,
          },
        }
      );
      localStorage.setItem('goodNumberDepura', this.actualGoodNumber + '');
    }
  }

  private prepareForm() {
    this.form = this.fb.group({
      type: [null],
      subtype: [null],
      ssubtype: [null],
      sssubtype: [null],
      idLot: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      lotDesc: [null, [Validators.pattern(STRING_PATTERN)]],
      idEvent: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      eventDesc: [null, [Validators.pattern(STRING_PATTERN)]],
      fileNumber: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      noBien: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      noClasif: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      status: [null, [Validators.pattern(STRING_PATTERN)]],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unidad: [null, [Validators.pattern(STRING_PATTERN)]],
      cantidad: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      delegation: [null],
      subdelegation: [null],
      valRef: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaAval: [null],
      valorAval: [null, [Validators.pattern(DOUBLE_POSITIVE_PATTERN)]],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      latitud: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      longitud: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      avaluo: ['0'],
    });
  }

  onFileChange(event: any) {
    console.log(event);
  }

  handleEvent(data: any) {
    console.log('Evento recibido:', data);
  }

  updateClasif(event: any) {
    console.log(event);
  }

  updateDelegation(event: any) {
    console.log(event);
    this.delegacion = event.id;
  }

  updateSubdelegation(event: any) {
    console.log(event);
    this.subdelegacion = event.id;
  }

  async save() {
    console.log(this.data);
    let body: any = {
      id: this.good.id,
      goodId: this.good.goodid,
    };
    let tableValid = true;
    this.data.forEach(row => {
      if (row.required && !row.value) {
        this.alert(
          'error',
          'Depuración de imágenes del bien ' + this.numberGood.value,
          'Complete el atributo ' + row.attribute
        );
        tableValid = false;
        return;
      }
      body[row.column] = row.value;
    });
    if (!tableValid) {
      return;
    }
    this.good.description;
    body['description'] = this.descripcion.value;
    body['unit'] = this.goodUnit.value;
    body['delegationNumber'] = this.delegacion;
    body['subDelegationNumber'] = this.subdelegacion;
    body['quantity'] = this.goodQuantity.value;
    body['referenceValue'] = this.goodReference.value;
    body['appraisedValue'] = this.goodAppraisal.value;
    body['appraisalVigDate'] = firstFormatDateToSecondFormatDate(
      this.goodDateVigency.value
    );
    body['cveCurrencyAppraisal'] = this.good.cveCurrencyAppraisal;
    body['observationss'] = this.goodObservations.value;
    if (this.goodAppraisal2.value) {
      body['appraisal'] = 'Y';
    }
    if (this.type.value + '' === '6' && this.subtype.value + '' === '1') {
      if (!this.good.val14) {
        body.val14 = 'S';
      }
    }
    const preUpdateValid = await this.preUpdate();
    if (!preUpdateValid) {
      return;
    }
    if (this.selectedBad && this.selectedBad.motive) {
      if (
        this.selectedBad.motive.includes('SIN FOTOS') &&
        this.service.files.length === 0
      ) {
        this.alert('error', 'ERROR', 'Debe subir fotos al bien');
        return;
      }
      this.attribGoodBadService
        .remove(this.selectedBad)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            // console.log(response);
          },
          error: err => {
            console.log(err);
          },
        });
    }

    this.goodService
      .update(body)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'Depuración de fotografías del bien ' + this.numberGood.value,
            'Actualizadas Correctamente'
          );
        },
      });
  }

  clearFilter() {
    this.bodyGoodCharacteristics = {};
    this.noExpedient = null;
    this.actualGoodNumber = null;
    this.selectedBad = null;
    this.service.files = [];
    this.form.reset();
    this.good = null;
    this.data = [];
    this.totalItems = 0;
    this.staticTabs.tabs[1].disabled = true;
    this.staticTabs.tabs[2].disabled = true;
  }
  private async getDelegacionJoinSubdelDepartamentos() {
    return firstValueFrom(
      this.segxAccessService
        .getDelegationUser(localStorage.getItem('username'))
        .pipe(
          catchError(x => {
            return of({ data: [] });
          }),
          map(x => {
            return x.data;
          })
        )
    );
  }

  private async goodIsPartialize() {
    return await firstValueFrom(
      this.goodPartialize
        .isPartializeGood(this.numberGood.value)
        .pipe(catchError(x => of(null)))
    );
  }

  private async checkPartialize() {
    let vb_parcial = false;
    // debugger;
    const delegaciones = await this.getDelegacionJoinSubdelDepartamentos();
    if (delegaciones) {
      if (delegaciones.length > 1) {
        this.LVALIDA = true;
      } else {
        if (delegaciones[0] === 0) {
          this.LVALIDA = false;
        }
      }
    } else {
      this.LVALIDA = true;
    }
    if ('ATP,ADM'.includes(this.goodStatus.value) && this.LVALIDA) {
      this.disabledDescripcion = true;
      if (!this.disabledBienes) {
        this.errorMessage =
          'No se puede editar la descripción de un bien ' +
          this.good.status +
          ' con delegaciones';
      }
    } else {
      const partializedGoods = await this.goodIsPartialize();
      if (partializedGoods) {
        vb_parcial = true;
      }
      if (vb_parcial) {
        this.disabledDescripcion = true;
        if (!this.disabledBienes) {
          this.errorMessage =
            'No se puede editar la descripción de un bien parcializado ';
        }
      } else {
        this.disabledDescripcion = false;
      }
    }
  }

  nval(column: number) {
    const valTemp = this.data.find(row => row.column === 'val' + column);
    const good: any = this.good;
    return valTemp ? valTemp.value : good ? good['val' + column] ?? null : null;
  }

  // private async

  async postQuery() {
    // debugger;
    this.errorMessage = null;
    await this.postRecord(true);
    this.loading = false;
    setTimeout(() => {
      this.goodChange++;
    }, 100);
    const filterParams = new FilterParams();
    filterParams.addFilter('id', 'CLASINUMER', SearchFilter.EQ);
    const vn_clas_nume = await firstValueFrom(
      this.parameterService
        .getAllWithFilters(filterParams.getParams())
        .pipe(catchError(x => of(null)))
    );
    if (
      !vn_clas_nume ||
      !vn_clas_nume.data ||
      (vn_clas_nume.data && vn_clas_nume.data.length === 0)
    ) {
      this.alert(
        'error',
        'Error de parametrización',
        'No se tiene parametrizada la clasificación del numerario'
      );
      return;
    }

    await this.checkPartialize();
  }

  private getNewApraisedValueForVnValores(vnPunto: number, val: string) {
    return (
      +val.substring(0, vnPunto - 1) +
      (+val.substring(vnPunto + 1, val.length - vnPunto) / 100).toFixed(2)
    );
  }

  private async pupBuscaNumerario() {
    let vn_simb: number,
      vf_fecha: string,
      vn_impor: number,
      lbln_encontro: boolean,
      lbln_conciliado: string;
    vn_simb = this.nval(5).indexOf('/');
    if (vn_simb > 0) {
      vf_fecha = firstFormatDate(new Date(this.nval(5)));
    } else {
      vn_simb = this.nval(5).indexOf('-');
      if (vn_simb > 0) {
        vf_fecha = secondFormatDate(new Date(this.nval(5)));
      } else {
        vf_fecha = thirdFormatDate(new Date(this.nval(5)));
      }
    }
    try {
      vn_impor = +this.nval(2);
    } catch (x) {
      this.alert(
        'error',
        'Numerario',
        'Fallo al transformar la cantidad numerica del importe'
      );
      return false;
    }
    lbln_encontro = false;
    lbln_conciliado = 'N';
    lbln_conciliado = await firstValueFrom(
      this.comerDetailService.faCoinciliationGood({
        goodNumber: this.numberGood.value,
        expedientNumber: this.good.fileNumber,
        coinKey: this.nval(1),
        bankKey: this.nval(4),
        accountKey: this.nval(6),
        deposit: vn_impor,
        vf_fecha,
        update: 'S',
      })
    );
    if (lbln_conciliado === 'S') {
      this.di_numerario_conciliado = 'Conciliado';
    } else {
      this.alert(
        'warning',
        'Conciliación',
        'No se encontró un movimiento relacionado'
      );
    }
    return true;
  }

  private fillValInNumerario(column: number = 2, type: number = 0) {
    let index = this.data.findIndex(row => row.column === 'val' + column);
    if (index > -1) {
      this.data[index].value =
        this.pufQuitaCero((this.data[index] + '').replace(',', '.')) + '';
      let vnPunto = (this.data[index] + '').indexOf('.');
      if (vnPunto != 0) {
        try {
          if (type === 0) {
            this.goodAppraisal.setValue(this.data[index].value);
          } else {
            this.numberClassification.setValue(
              this.getNewApraisedValueForVnValores(
                vnPunto,
                this.data[index].value
              )
            );
          }
          return true;
        } catch (x) {
          this.alert(
            'error',
            'Numerario',
            'Verifique el valor númerico del campo ' + column
          );
          return false;
        }
      } else {
        try {
          this.goodAppraisal.setValue(this.data[index].value);
          return true;
        } catch (x) {
          this.alert(
            'error',
            'Numerario',
            'Verifique el valor númerico del campo ' + column
          );
          return false;
        }
      }
    }
    return true;
  }
  private async excepNumerario() {
    const filterParams = new FilterParams();
    // filterParams.limit = 1000;
    filterParams.addFilter(
      'id',
      'CLASINUMER,CLASINUMEF,CLASIOTMON,CLASIVALOR,CLASICTAS',
      SearchFilter.IN
    );
    const parameters = await firstValueFrom(
      this.parameterService
        .getAllWithFilters(filterParams.getParams())
        .pipe(catchError(x => of(null)))
    );
    if (!parameters) {
      this.alert('error', 'Excep Numerario', 'No pudo cargar los parametros');
      return false;
    }
    const data = parameters ? parameters.data : [];
    // const vn_NumEfe = data.find(item => item.id === 'CLASINUMER')?.initialValue;
    const vn_NumFis = data.find(item => item.id === 'CLASINUMEF')?.initialValue;
    const vn_OtrMon = data.find(item => item.id === 'CLASIOTMON')?.initialValue;
    const vn_Valores = data.find(
      item => item.id === 'CLASIVALOR'
    )?.initialValue;
    const vn_Ctas = data.find(item => item.id === 'CLASICTAS')?.initialValue;
    let clasificators = '62,1424,1426,1575,1590';
    if (vn_NumFis) {
      clasificators = clasificators + ',' + vn_NumFis;
    }
    if (vn_OtrMon) {
      clasificators = clasificators + ',' + vn_OtrMon;
    }
    if (
      this.numberClassification.value &&
      clasificators.includes(this.numberClassification.value + '')
    ) {
      if (
        '62,1424,1426,1590'.includes(this.numberClassification.value + '') &&
        this.di_numerario_conciliado === 'No Conciliado'
      ) {
        const result = await this.pupBuscaNumerario();
        if (result === false) {
          return false;
        }
      }
      if (!this.fillValInNumerario(2)) {
        return false;
      }

      const val3 = this.data.find(item => item.column === 'val3');
      if (this.numberClassification.value === vn_NumFis) {
        this.good.cveCurrencyAppraisal = val3 ? val3.value : null;
      } else {
        this.good.cveCurrencyAppraisal = this.nval(1);
      }
    } else if (this.numberClassification.value === vn_Valores) {
      if (!this.fillValInNumerario(3, 1)) {
        return false;
      }
      this.good.cveCurrencyAppraisal = this.nval(2);
    } else if (this.numberClassification.value === vn_Ctas) {
      if (!this.fillValInNumerario(7, 1)) {
        return false;
      }
      this.good.cveCurrencyAppraisal = this.nval(6);
    }
    return true;
  }

  validationTypeSubtype() {
    return (
      this.type &&
      this.type.value === '6' &&
      this.subtype &&
      this.subtype.value + '' === '1'
    );
  }
  async preUpdate() {
    if (this.descripcion && this.descripcion.value) {
      const tamanio = this.descripcion.value.length;
      if (tamanio <= 1) {
        this.alert(
          'error',
          'Descripción bien',
          'Verifique la cantidad de carácteres (no menor a 2 posiciones).'
        );
        return false;
      }
      if (this.validationTypeSubtype()) {
        if (this.nval(14) === 'S') {
          if (this.goodAppraisal.value === null) {
            // this.onLoadToast(
            //   'error',
            //   'Valor avalúo',
            //   'Debe indicarlo de contar con él'
            // );
            this.alertInfo(
              'error',
              'Valor avalúo',
              'Debe indicarlo de contar con él'
            );
            //consultar forms
            return false;
          } else {
            //consultar forms
          }
        }
      }
      const resultNumerario = await this.excepNumerario();
      return resultNumerario;
    } else {
      // this.onLoadToast('error', 'Descripción bien', 'No debe ser nula');
      this.alertInfo('error', 'Descripción bien', 'No debe ser nula');
      return false;
    }
  }

  private fillParams(byPage = false) {
    if (byPage) {
      this.filterParams.page = this.params.getValue().page;
      return true;
    }
    this.filterParams = new FilterParams();
    this.filterParams.limit = 1;
    this.filterParams.page = this.params.getValue().page;
    if (this.numberGood && this.numberGood.value) {
      this.filterParams.addFilter('id', this.numberGood.value);
      this.bodyGoodCharacteristics.noGood = this.numberGood.value;
      return true;
    }
    // if (this.fileNumber && this.fileNumber.value) {
    //   this.filterParams.addFilter('fileNumber', this.fileNumber.value);
    //   this.bodyGoodCharacteristics.fileNumber = this.fileNumber.value;
    //   return true;
    // }
    if (this.type && this.type.value) {
      this.filterParams.addFilter('goodTypeId', this.type.value);
      this.bodyGoodCharacteristics.noType = this.type.value;
    }
    if (this.subtype && this.subtype.value) {
      this.filterParams.addFilter('subTypeId', this.subtype.value);
      this.bodyGoodCharacteristics.noSubType = this.subtype.value;
    }
    if (this.ssubtype && this.ssubtype.value) {
      this.filterParams.addFilter('ssubTypeId', this.ssubtype.value);
      this.bodyGoodCharacteristics.noSsubType = this.ssubtype.value;
    }
    if (this.sssubtype && this.sssubtype.value) {
      this.filterParams.addFilter('sssubTypeId', this.sssubtype.value);
      this.bodyGoodCharacteristics.noSssubType = this.sssubtype.value;
    }
    if (this.filterParams.getFilterParams()) {
      return true;
    }
    return false;
  }

  private pufQuitaCero(pcValor: string) {
    let vcVal = pcValor;
    let vnPunto = pcValor.indexOf('.');
    let vnIni, vnFin;
    if (vnPunto != 0) {
      vnIni = vnPunto + 1;
      vnFin = pcValor.length;
      const afterPunto = vcVal.substring(vnIni, vnFin);
      vcVal = vcVal.substring(0, vnIni) + afterPunto.replaceAll('0', '');
    }
    return vcVal;
  }

  private async fillSelectedBad() {
    // debugger;
    this.selectedBad = await firstValueFrom(
      this.attribGoodBadService.getById(this.good.id).pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => of(null))
      )
    );
  }

  async searchGood(byPage = false) {
    // debugger;
    this.loading = true;
    this.getByIdGood(this.form.value.noBien);
    if (this.fillParams(byPage)) {
      const newListParams = new ListParams();
      newListParams.limit = this.filterParams.limit;
      newListParams.page = this.filterParams.page;
      const response = await firstValueFrom(
        this.goodProcessService
          .getDistinctTypes(this.bodyGoodCharacteristics, newListParams)
          .pipe(
            catchError(x => of(null)),
            map(x => {
              return {
                ...x,
                data: x
                  ? x.data
                    ? x.data.map(item => {
                        return {
                          ...item,
                          quantity: item.quantity
                            ? +(item.quantity + '')
                            : null,
                        };
                      })
                    : []
                  : [],
              };
            })
          )
      );
      if (response && response.data && response.data.length > 0) {
        this.staticTabs.tabs[1].disabled = false;
        this.staticTabs.tabs[1].active = true;
        // this.staticTabs.tabs[2].disabled = false;
        let item = response.data[0];
        this.totalItems = response.count ?? 0;
        if (item) {
          this.actualGoodNumber = item.id;
          this.good = item;
          if (!this.selectedBad) {
            await this.fillSelectedBad();
          }
          console.log(this.selectedBad);
          if (
            this.selectedBad &&
            this.selectedBad.motive.includes('SIN FOTOS')
          ) {
            this.showPhoto = true;
          } else {
            this.showPhoto = false;
          }
          this.numberGood.setValue(item.id);
          this.fileNumber.setValue(this.noExpedient);
          // this.form.get('ssubtype').setValue(item.no_ssubtipo);
          // this.form.get('sssubtype').setValue(item.no_sssubtipo);
          this.loadTypes = true;
          const delegacion = item.delegationnumber;
          if (delegacion) {
            this.delegacion = delegacion;
            this.delegation.setValue(delegacion);
          }
          const subdelegacion = item.subdelegationnumber;
          if (subdelegacion) {
            this.subdelegacion = subdelegacion;
            this.subdelegation.setValue(subdelegacion);
          }
          // this.getLatitudLongitud(item.goodid);
          this.numberClassification.setValue(item.goodclassnumber);
          this.goodStatus.setValue(item.status);
          this.fileNumber.setValue(this.noExpedient);
          this.idLot.setValue(this.lot);
          this.descripcion.setValue(item.description);
          this.goodUnit.setValue(item.unit);
          this.goodQuantity.setValue(item.quantity);
          this.goodReference.setValue(item.referencevalue);
          this.goodAppraisal.setValue(item.appraisedvalue);
          this.goodDateVigency.setValue(
            formatForIsoDate(item.appraisalvigdate, 'string')
          );
          // this.goodLatitude.setValue(item.latitude);
          // this.goodLongitude.setValue(item.longitud);
          this.goodObservations.setValue(item.observationss);
          if (item.appraisal === null) {
            this.goodAppraisal2.setValue(false);
          } else {
            this.goodAppraisal2.setValue(true);
            this.totalItems = 0;
          }
          // this.getTDicta();
          await this.postQuery();
        } else {
          this.loading = false;
          this.goodChange++;
          this.alert('error', 'Error', 'No existe biene');
          // this.service.goodChange.next(false);
        }
      } else {
        this.totalItems = 0;
        this.loading = false;
        this.goodChange++;
        this.alert('error', 'Error', 'No existen bienes');
        // this.service.goodChange.next(false);
        // this.onLoadToast('error', 'ERROR', 'No existen bienes');
      }
    } else {
      this.loading = false;
      this.totalItems = 0;
      this.goodChange++;
      // this.service.goodChange.next(false);
    }
  }

  getDelegation(id: any) {
    this.serviceDeleg.getById(id).subscribe(data => {
      this.delegation.setValue(data.description);
    });
  }

  getSubdelegation(id: any) {
    this.subdelegationService.getById(id).subscribe(data => {
      this.subdelegation.setValue(data.description);
    });
  }

  private getStatusXPantalla() {
    const filterParams = new FilterParams();
    filterParams.addFilter('screenKey', 'FDEPURAFOTOS');
    filterParams.addFilter('status', this.good.status);
    return this.statusScreenService
      .getList(filterParams.getFilterParams())
      .pipe(map(x => (x.data ? x.data : [])));
  }

  // debugger;
  private async postRecord(isPostQuery = false) {
    const filterParams = new FilterParams();
    filterParams.addFilter('typeNumber', 'CARBIEN');
    // filterParams.addFilter('user', 'DR_SIGEBI');
    filterParams.addFilter(
      'user',
      localStorage.getItem('username').toUpperCase()
    );
    filterParams.addFilter('reading', 'S');
    // filterParams.addFilter()
    const rdicta = await firstValueFrom(
      this.dictationService
        .getRTdictaAarusr(filterParams.getParams())
        .pipe(catchError(x => of({ count: 0 })))
    );
    if (rdicta && rdicta.count && rdicta.count > 0) {
      this.haveTdictaUser = true;
    }
    if (isPostQuery) {
      this.fillAvaluo();
    }
    await this.getValidations();
  }

  private fillAvaluo() {
    if (this.goodAppraisal.value === null) {
      if (this.good.val14 === 'S') {
        this.goodAppraisal2.setValue(true);
      } else if (this.good.val14 === 'N') {
        this.goodAppraisal2.setValue(false);
      } else {
        if (this.good.val14 === null) {
          this.goodAppraisal2.setValue(false);
        } else {
          this.goodAppraisal2.setValue(true);
        }
      }
    } else {
      if (this.good.val14 === 'S') {
        this.goodAppraisal2.setValue(true);
      }
      if (this.good.val14 === 'N') {
        this.goodAppraisal2.setValue(true);
      }
      if (this.good.val14 !== 'S' && this.good.val14 !== 'N') {
        this.goodAppraisal2.setValue(true);
      }
      if (this.goodAppraisal.value != null && this.good.val14 === 'N') {
        this.good.val14 = 'S';
      }
      if (this.goodAppraisal.value != null && this.good.val14 === null) {
        this.good.val14 = 'S';
      }
    }
  }

  private activateForEdit() {
    this.disabledBienes = false;
    this.disabledTable = false;
    this.disabledNoClasifBien = false;
    this.disabledDescripcion = false;
    this.errorMessage = null;
  }

  private disactivateForStatus() {
    this.disabledBienes = true;
    this.disabledDescripcion = true;
    this.disabledTable = true;
    this.disabledNoClasifBien = true;
    this.errorMessage =
      'El estatus ' + this.good.status + ' no es válido para editar';
  }

  private disactivateForUser() {
    this.disabledBienes = true;
    this.disabledDescripcion = true;
    this.disabledTable = true;
    this.disabledNoClasifBien = true;
    this.errorMessage = 'El usuario no tiene permisos de escritura';
  }

  private async getValidations() {
    // debugger;
    const response = await firstValueFrom(
      this.getStatusXPantalla().pipe(catchError(x => of(null)))
    );
    if (response) {
      const di_disponible_e = response.filter(x => x.action === 'E').length;
      const di_disponible = response.filter(
        x => x.action === null || x.action === 'null'
      ).length;
      const di_disponible_d = response.filter(x => x.action === 'D').length;
      if (di_disponible > 0) {
        this.activateForEdit();
      } else {
        if (this.haveTdictaUser) {
          if (di_disponible_e > 0 || di_disponible_d > 0) {
            this.activateForEdit();
          } else {
            this.disactivateForStatus();
          }
        } else {
          this.disactivateForUser();
        }
      }
    } else {
      this.disactivateForStatus();
    }
    // this.disabledBienes = false;
  }

  getGoods(ssssubType: IGoodSssubtype) {
    // this.good = ssssubType.numClasifGoods;
  }

  loadImages() {
    let loadingPhotos = 0;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      goodProg: this.good,
      programming: this.programming,
      process: 'programming',
      callBack: (next: boolean) => {
        if (next) {
          this.formLoading = true;
          loadingPhotos = loadingPhotos + 1;
          setTimeout(() => {
            this.getImageGood();
            this.formLoading = false;
          }, 8000);
          if (loadingPhotos == 1) {
            this.alertInfo(
              'success',
              'Acción correcta',
              'Imagen agregada correctamente'
            ).then();
          }
        }
      },
    };
    this.modalService.show(UploadFileComponent, config);
  }

  viewImage(data: IPhotos) {
    this.wcontentService.getObtainFile(data.dDocName).subscribe(data => {
      const type = this.detectMimeType(data);
      let blob = this.dataURItoBlob(data, type);
      let file = new Blob([blob], { type });

      const fileURL = URL.createObjectURL(file);
      this.openPrevImg(fileURL);
    });
  }

  dataURItoBlob(dataURI: any, type: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type });
    return blob;
  }

  openPrevImg(imageUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl),
          type: 'img',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  detectMimeType(base64String: string, fileName = 'unamedfile') {
    let ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (ext === undefined || ext === null || ext === '') ext = 'bin';
    ext = ext.toLowerCase();
    const signatures: any = {
      JVBERi0: 'application/pdf',
      R0lGODdh: 'image/gif',
      R0lGODlh: 'image/gif',
      iVBORw0KGgo: 'image/png',
      TU0AK: 'image/tiff',
      '/9j/': 'image/jpg',
      UEs: 'application/vnd.openxmlformats-officedocument.',
      PK: 'application/zip',
    };
    for (const s in signatures) {
      if (base64String.indexOf(s) === 0) {
        let x = signatures[s];
        if (ext.length > 3 && ext.substring(0, 3) === 'ppt') {
          x += 'presentationml.presentation';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'xls') {
          x += 'spreadsheetml.sheet';
        } else if (ext.length > 3 && ext.substring(0, 3) === 'doc') {
          x += 'wordprocessingml.document';
        }
        return x;
      }
    }
    const extensions: any = {
      xls: 'application/vnd.ms-excel',
      ppt: 'application/vnd.ms-powerpoint',
      doc: 'application/msword',
      xml: 'text/xml',
      mpeg: 'audio/mpeg',
      mpg: 'audio/mpeg',
      txt: 'text/plain',
    };
    for (const e in extensions) {
      if (ext.indexOf(e) === 0) {
        const xx = extensions[e];
        return xx;
      }
    }
    return 'unknown';
  }

  goBack() {
    if (
      this.origin1 == 'FACTJURDICTAMOFICIO' &&
      this.origin == 'FATRIBREQUERIDO'
    ) {
      this.router.navigate(
        [`/pages/general-processes/goods-with-required-information`],
        {
          queryParams: {
            ...this.paramsScreenOffice,
            TIPO_PROC: this.TIPO_PROC,
            NO_INDICADOR: this.NO_INDICADOR,
            origin: this.origin1,
            origin2: this.origin2,
            origin3: this.origin3,
          },
        }
      );
    } else {
      this.location.back();
    }
  }
  getComerGoodAll(id: number) {
    this.lotService.getByLotEventPhoto(id, this.params.getValue()).subscribe({
      next: resp => {
        this.lot = resp;
        console.log(resp);
      },
      error: error => {
        console.log(error);
      },
    });
  }
  // getComerGoodLotes(id: number) {
  //   this.comerEventService
  //     .getAllFilterComerGoodEvent(id, this.params.getValue())
  //     .subscribe({
  //       next: (resp: any) => {
  //         this.lot = resp.data;
  //         console.log(this.lot);
  //         this.form.get('idLot').patchValue(this.lot.idLot);
  //         this.form.get('lotDesc').patchValue(this.lot.lotDescription);
  //         // this.idLot.setValue(this.lot.lotId);
  //         // this.lotDesc.setValue(this.lot.lotDescription);
  //         console.log(resp);
  //       },
  //       error: error => {
  //         console.log(error);
  //       },
  //     });
  // }
  getComerGoodLotes(id: number) {
    this.lotService.getGlobalGoodEventLot(id).subscribe({
      next: (data: any) => {
        this.lot = data;
        console.log(data);
      },
      error: () => {
        console.log('error');
      },
    });
  }
  setGood(good: IGood) {
    this.numberGood.setValue(good.id);
    this.fileNumber.setValue(this.noExpedient);
    this.descripcion.setValue(good.description);
    this.idLot.setValue(good.lotNumber);
    // this.form.get('lotDesc').patchValue(good.lotDescription);
    // this.form.controls['fileNumber'].setValue(this.noExpedient);
  }

  searchExp(id: number | string) {
    if (!id) return;

    this.params.getValue().page = 1;
    this.loading = true;
    this.goodService.getByExpedient(id, this.params.getValue()).subscribe({
      next: resp => {
        const data = resp.data;
        this.loading = false;
        data.map(async (good: any, index: any) => {
          if (index == 0) this.di_desc_est = good.estatus.descriptionStatus;
          good.di_disponible = 'S';
          await new Promise((resolve, reject) => {
            const body = {
              no_bien: good.id,
              estatus: good.status,
              identificador: good.identifier,
              vc_pantalla: 'FDEPURAFOTOS',
              proceso_ext_dom: good.extDomProcess ?? '',
            };
          });
        });

        this.goods = data;
        this.totalItems = resp.count || 0;

        // this.onLoadDictationInfo();
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getEvent(id: number) {
    this.comerEventService.getAllFilterComerGood(id).subscribe({
      next: data => {
        data.data.map(data => {
          return data;
        });
      },
      error: () => {
        console.error('error');
      },
    });
  }

  getImageGood() {
    this.loading = true;
    const formDatra: Object = {
      xidBien: this.form.value.noBien,
    };
    this.wcontentService.getDocumentos(formDatra).subscribe({
      next: response => {
        const _data = response.data.filter((img: any) => {
          if (img.dDocType == 'DigitalMedia') {
            return img;
          }
          //if (img.dDocType == 'DigitalMedia') return img;
        });

        if (_data.length > 0) {
          this.photographs =
            _data.length > 10 ? this.setPaginate([..._data]) : _data;
          this.totalItemsPhotos = _data.length;
          this.loading = false;
        } else {
          this.alert(
            'warning',
            'Información',
            'No hay imágenes agregadadas a este bien'
          );
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  getByIdGood(id: number | string) {
    this.goodService.getById(id).subscribe({
      next: (data: any) => {
        this.goodO = data;
        data.data.filter((good: IGood) => {
          this.noExpedient = good.fileNumber;
          this.fileNumber.setValue(good.fileNumber);
        });
        console.log(this.noExpedient);
        this.searchExp(this.noExpedient);
        // this.setGood(this.goodO);
        this.getComerGoodLotes(this.goodO.lotNumber);
        // this.getEvent(this.goodO.lotNumber);
      },
      error: error => {
        console.error('no existe el bien');
      },
    });
  }

  getIdLot(id: number) {
    const datos: any = {};
    this.comerEventService.getAllFilterComerGoodLot(id).subscribe({
      next: resp => {
        //console.log(resp);
        this.form.controls['idEvent'].setValue(resp.id);
        // this.form.get['idEvent'].setValue(resp.id);
      },
      error: error => {
        console.log(error);
      },
    });
  }
  getGoodPhoto(params: ListParams) {
    this.loading = true;
    params['filter.goodNumber'] = `$eq:${this.form.value.noBien}`;
    this.goodPhotoService.getFilterGoodPhoto(params).subscribe({
      next: response => {
        this.goodPhoto = response.data;
        this.totalItems = response.count;
        this.goodDateTable.load(response.data);
        this.goodDateTable.refresh();
        this.loading = false;
        console.log(this.goodPhoto);
      },
      error: error => (this.loading = false),
    });
  }

  searchExpModal(expedient?: IExpedient[]) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      expedient,
    };
    let modalRef = this.modalService.show(AllExpedientComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      console.log(next);
      this.good.id = next.id;
      this.good.fileNumber = next.fileNumber.id;

      this.form.patchValue({
        noBien: next.good.id,
        fileNumber: next.good.fileNumber,
      });
    });
  }
  getLotebyEvent(id: number, params: ListParams) {
    this.lotService.getLotbyEvent(id, params).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: () => {
        console.log('error');
      },
    });
  }
}
