import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { maxDate } from 'src/app/common/validations/date.validators';
import { IPupGoodTrackerRga } from 'src/app/core/models/catalogs/package.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IFestatus } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import {
  IAvailableFestatus,
  ITmpCreateAuthoDestroy,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGoodService } from 'src/app/core/services/ms-dictation/dictation-x-good.service';
import { CopiesOfficialOpinionService } from 'src/app/core/services/ms-dictation/ms-copies-official-opinion.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { CLOSE_PROCEEDING_MESSAGE } from '../email-modal/messages/close-proceeding-message';
import {
  ACTA_RECEPTION_COLUMNS,
  DETAIL_PROCEEDINGS_DELIVERY_RECEPTION,
  DICTATION_COLUMNS,
  GOODS_COLUMNS,
  PROCEEDINGS_COLUMNS,
} from './columns';
import { IDestructionAuth } from './store/destruction-auth.interface';
import { getDestructionAuth } from './store/destruction-auth.selector';

export interface IReport {
  data: File;
}

@Component({
  selector: 'app-destruction-authorization',
  templateUrl: './destruction-authorization.component.html',
  styles: [],
})
export class DestructionAuthorizationComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  totalItems4: number = 0;
  totalItems5: number = 0;
  totalItems6: number = 0;
  columnFilters: any = [];
  goodIds: any = [];
  numberPro: any = [];
  array: any = [];
  array1: any = [];
  $state = this.store.select(getDestructionAuth);
  state: IDestructionAuth;
  modalRef: BsModalRef;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  params5 = new BehaviorSubject<ListParams>(new ListParams());
  params6 = new BehaviorSubject<ListParams>(new ListParams());
  params7 = new BehaviorSubject<ListParams>(new ListParams());
  params8 = new BehaviorSubject<ListParams>(new ListParams());

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter2: SearchBarFilter;

  proceedingsList: IProccedingsDeliveryReception[] = [];
  proceedings: IProccedingsDeliveryReception;

  detailProceedingsList: IDetailProceedingsDeliveryReception[] = [];
  detailProceedings: IDetailProceedingsDeliveryReception;
  dictaList: { clave_oficio_armada: string }[] = [];

  goodPDS: IGood[] = [];

  goods: IDetailProceedingsDeliveryReception;

  settings2: any = [];
  settings3: any = [];
  settings4: any = [];
  settings5: any = [];

  rowSelected: boolean = false;
  selectedRow: any = null;

  data: LocalDataSource = new LocalDataSource();
  actaList2: LocalDataSource = new LocalDataSource();
  dictaList2: LocalDataSource = new LocalDataSource();
  detailProceedingsList2: LocalDataSource = new LocalDataSource();
  goodPDS1: LocalDataSource = new LocalDataSource();
  actaList: { cve_acta: string }[] = [];

  loadingProceedings = false;
  loadingGoods = false;
  loadingGoodsByP = false;
  goodsTrackerLoading = false;
  loadingDictation = false;
  loadingReport = false;
  loadingActReception = false;
  show: boolean = false;
  show2: boolean = false;

  proceedingForm = this.fb.group({
    id: [null],
    keysProceedings: [
      null,
      [
        Validators.required,
        Validators.pattern(STRING_PATTERN),
        Validators.maxLength(60),
      ],
    ],
    affair: [
      null,
      [Validators.pattern(STRING_PATTERN), Validators.maxLength(70)],
    ],
    datePhysicalReception: [null, [maxDate(new Date())]],
    elaborationDate: [null, [Validators.required]],
    closeDate: [null],
    captureDate: [null],
    statusProceedings: [null],
    observations: [null, [Validators.pattern(STRING_PATTERN)]],
    universalFolio: [null],
    elaborate: [null],
    numFile: [null],
    typeProceedings: [null],
    numDelegation1: [null],
    numDelegation2: [null],
  });
  ngGlobal: IGlobalVars = null;
  conserveState = false;
  delegation: number = null;
  subdelegation: number = null;
  department: number = null;
  username: string = null;
  refusedGoods: string[];

  //AGREGADO POR GRIGORK
  selectGoodProc: any = null;
  selectGoodGen: any = null;
  isCommingTracker: boolean = true;
  flatGoodFlag: boolean = false;
  newProceedingFlag: boolean = false;
  numFile: number = null;
  dataGoods: any = [];
  user: string = null;
  searched: boolean = false;
  today: Date = new Date();

  @ViewChild('focusElement', { static: true })
  focusElement: ElementRef<HTMLInputElement>;

  @ViewChild('closeDate', { static: true })
  closeDate: ElementRef<HTMLInputElement>;

  @ViewChild('modal', { static: true }) modal: TemplateRef<HTMLElement>;

  queryMode = false;

  goodTrackerGoods: Partial<IDetailProceedingsDeliveryReception>[] = [];
  selectedGoods: IDetailProceedingsDeliveryReception[] = [];
  good: IGood[] = [];
  get controls() {
    return this.proceedingForm.controls;
  }

  constructor(
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private modalService: BsModalService,
    private goodService: GoodService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private dictationXGoodService: DictationXGoodService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private globalVarService: GlobalVarsService,
    private store: Store<IDestructionAuth>,
    private segAccessXArea: SegAcessXAreasService,
    private authService: AuthService,

    private documentsService: DocumentsService,
    private siabService: SiabService,
    private massiveGoodService: MassiveGoodService,
    private datePipe: DatePipe,
    private goodprocessService: GoodprocessService,
    private copiesOfficialOpinionService: CopiesOfficialOpinionService,
    //SERVICIOS AGREGADOS POR GRIGORK
    private expedientService: ExpedientService,
    private proceedingService: ProceedingsService,
    private readonly goodServices: GoodService,
    private goodTrackerService: GoodTrackerService
  ) {
    super();

    this.searchFilter = {
      field: 'keysProceedings',
      operator: SearchFilter.ILIKE,
    };

    this.searchFilter2 = {
      field: 'description',
      operator: SearchFilter.ILIKE,
    };

    this.settings = {
      //Actas
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...PROCEEDINGS_COLUMNS },
      hideSubHeader: false,
    };

    this.settings2 = {
      //Bienes por actas
      ...this.settings,
      actions: false,
      columns: {
        ...DETAIL_PROCEEDINGS_DELIVERY_RECEPTION,
        /* selection: {
          title: '',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectGoodAct(instance),
          filter: false,
          sort: false,
        }, */
      },
      hideSubHeader: false,
    };

    this.settings3 = {
      //Bienes en estatus PDS
      ...this.settings,
      actions: false,
      columns: {
        ...GOODS_COLUMNS,
        /* selection: {
          title: '',
          sort: false,
          type: 'custom',
          filter: false,
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectGoodPSD(instance),
        }, */
      },
      hideSubHeader: false,
      rowClassFunction: (row: any) => {
        const di_disponible = row.data.di_disponible;
        if (di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };

    this.settings4 = {
      //Actas de recepción
      ...this.settings,
      actions: false,
      columns: { ...ACTA_RECEPTION_COLUMNS },
      hideSubHeader: false,
    };

    this.settings5 = {
      //dictaminaciones
      ...this.settings,
      actions: false,
      columns: { ...DICTATION_COLUMNS },
      hideSubHeader: false,
    };
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  private tempArrayGood: any = [];
  private selectedGood: any = null;
  private goodsAct: any = [];

  onSelectGoodAct(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        if (data.toggle) {
          console.log(this.goodsAct);
          this.goodsAct.push(data.row);
        } else {
          console.log(data.row.goodNumber);
          console.log(this.goodsAct);
          this.goodsAct = this.goodsAct.filter(
            valor => valor.goodNumber != data.row.goodNumber
          );
        }
      },
    });
  }

  onSelectGood(instance: CheckboxElementComponent) {
    if (this.controls.statusProceedings.value == 'CERRADA') {
      instance.disabled = true;
    }

    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        this.selectGood(data.row, data.toggle);

        // Desseleccionar el elemento previamente seleccionado
        if (this.selectedGood && this.selectedGood !== data.row) {
          this.selectedGood.toggle = false;
          const index = this.array1.indexOf(this.selectedGood);
          if (index !== -1) {
            this.array1.splice(index, 1);
          }
        }

        this.tempArrayGood = [...this.array1];
        console.log(this.array1);

        if (data.toggle) {
          // Si el checkbox se selecciona, agregar el elemento al array
          if (!this.array1.includes(data.row)) {
            this.array1.push(data.row);
          }
          // Establecer el elemento seleccionado actual
          this.selectedGood = data.row;
        } else {
          // Si el checkbox se deselecciona, eliminar el elemento del array
          const index = this.array1.indexOf(data.row);
          if (index !== -1) {
            this.array1.splice(index, 1);
          }
          // Limpiar el elemento seleccionado actual
          this.selectedGood = null;
        }
      },
    });
  }

  private tempArray: any[] = [];

  onSelectGoodPSD(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        this.selectGoodPSD(data.row, data.toggle);

        if (data.toggle) {
          // Si el checkbox se selecciona, agregar el elemento al array
          if (!this.array.includes(data.row)) {
            this.array.push(data.row);
          }
        } else {
          // Si el checkbox se deselecciona, eliminar el elemento del array
          const index = this.array.indexOf(data.row);
          if (index !== -1) {
            this.array.splice(index, 1);
          }
          console.log(this.array);
        }
        this.tempArray = [...this.array];
      },
    });
  }

  deleteGood() {
    const { id } = this.controls;
    if (!this.controls.keysProceedings.value) {
      this.alert(
        'warning',
        'No se ha especificado el Oficio de Solicitud',
        'Debe especificar/buscar la Solicitud para despues eliminar el bien de esta'
      );
      return;
    }

    if (
      ['CERRADO', 'CERRADA'].includes(this.controls.statusProceedings.value)
    ) {
      this.alert(
        'warning',
        'Solictud cerrada',
        'La Solicitud ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return;
    }

    if (this.selectGoodProc == null) {
      this.alert(
        'warning',
        'No se ha seleccionado un bien',
        'Debe seleccionar un bien que forme parte de la Solicitud primero'
      );
      return;
    }

    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.goodIds = this.selectGoodProc.numberGood;
        this.numberPro = this.selectGoodProc.numberProceedings;

        console.log(this.goodIds, this.numberPro);
        this.deleteDetail();
      }
    });
  }

  deleteDetail() {
    this.detailProceeDelRecService
      .remove(this.goodIds, this.numberPro)
      .subscribe({
        next: () => {
          this.alert('success', 'Bien eliminado', '');
          this.getProceedingGoods();
          this.searchGoodsInDetailProceeding(this.numberPro);
          if (this.goodPDS1.count() > 0) {
            this.getGoodByStatusPDS();
          }
        },
        error: err => {},
      });
  }

  selectGood(good: IDetailProceedingsDeliveryReception, selected: boolean) {
    if (selected) {
      this.selectedGoods.push(good);
    } else {
      this.selectedGoods = this.selectedGoods.filter(
        _detail => _detail['numberGood'] != good['numberGood']
      );
    }
  }

  selectGoodPSD(good: IGood, selected: boolean) {
    if (selected) {
      this.good.push(good);
    } else {
      this.good = this.good.filter(
        _detail => _detail['goodNumber'] != good['goodNumber']
      );
    }
  }
  proceedingDetail(): any[] {
    return [...this.detailProceedingsList, ...this.goodTrackerGoods];
  }

  getUserInfo() {
    const { preferred_username } = this.authService.decodeToken();
    this.username = preferred_username;
    const params = new FilterParams();
    params.addFilter('user', preferred_username);
    this.segAccessXArea.getAll(params.getParams()).subscribe({
      next: response => {
        this.delegation = response.data[0].delegationNumber;
        this.subdelegation = response.data[0].subdelegationNumber;
        this.department = response.data[0].departamentNumber;
      },
      error: error => {
        this.alert(
          'error',
          'Error',
          'Ocurrió un error al obtener información necesaria para el funcionamiento de esta pantalla'
        );
      },
    });
  }

  setState() {
    this.$state.pipe(takeUntil(this.$unSubscribe)).subscribe(state => {
      this.state = state;
      const { form, trackerGoods } = this.state;
      this.proceedingForm.patchValue(form);
      const { id } = this.controls;
      if (!id.value) {
        return;
      }
      this.goodTrackerGoods = trackerGoods;
      //this.getProceedingGoods();
      this.searchGoodsInDetailProceeding(id.value);
      this.searchActa(id.value);
      this.searchDicta(id.value);
    });
  }

  ngOnInit(): void {
    this.queryMode = false;
    this.getUserInfo();
    this.conserveState = false;

    /*  this.$unSubscribe.subscribe({
      complete: () => {
        if (!this.conserveState) {
          this.store.dispatch(ResetDestructionAuth());
          return;
        }
        const destructionAuth: IDestructionAuth = {
          ...this.state,
          form: this.proceedingForm.value,
          trackerGoods: this.goodTrackerGoods,
        };
        this.store.dispatch(SetDestructionAuth({ destructionAuth }));
      },
    }); */

    this.show = true;
    this.show2 = true;
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.setState();
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES) {
            console.log(this.ngGlobal.REL_BIENES);

            this.newProceedingFlag =
              localStorage.getItem('newProceedingFlag') == 'S' ? true : false;

            if (this.isCommingTracker) {
              this.isCommingTracker = false;
              this.insertDetailFromGoodsTracker();
            }
          }
        },
      });

    this.goodPDS1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'goodId':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'quantity':
                searchFilter = SearchFilter.EQ;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params8 = this.pageFilter(this.params);
          this.getGoodByStatusPDS();
        }
      });

    this.params8.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.goodPDS1.count() > 0) {
        this.getGoodByStatusPDS();
      }
    });

    this.navigateGoodsProceeding();
    this.navigateProceedingsDelivery();
    this.navigateDictamination();
    this.researchWhenReturn();

    this.user = this.authService.decodeToken().preferred_username;
  }

  researchWhenReturn() {
    const idProceedingReturn = localStorage.getItem('idProceeding_FESTATUSRGA');
    if (
      idProceedingReturn &&
      idProceedingReturn != null &&
      idProceedingReturn != ''
    ) {
      console.log('Cargo');
      this.proceedingForm.get('id').setValue(idProceedingReturn);
      localStorage.removeItem('idProceeding_FESTATUSRGA');
      this.keyProceedingchange();
    }
  }

  navigateGoodsProceeding() {
    this.params7.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.detailProceedingsList2.count() > 0) {
        this.getProceedingGoods();
      }
    });
  }

  navigateProceedingsDelivery() {
    this.params5.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      const { id } = this.controls;
      this.searchActa(id.value);
    });
  }

  navigateDictamination() {
    this.params6.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      const { id } = this.controls;
      this.searchDicta(id.value);
    });
  }

  setExpedientNum(goodId: number | string) {
    const params = new FilterParams();
    params.addFilter('id', goodId);
    this.goodService.getAllFilter(params.getParams()).subscribe(good => {
      this.controls.numFile.setValue(good.data[0].fileNumber);
    });
  }

  //INGRESAMOS LOS BIENES QUE VIENEN DEL RASTREADOR
  insertDetailFromGoodsTracker() {
    console.log('Se está usando rastreador');
    const body: IPupGoodTrackerRga = {
      identifier: this.ngGlobal.REL_BIENES.toString(),
      user: this.authService.decodeToken().preferred_username,
    };

    this.goodsTrackerLoading = true;
    this.massiveGoodService.pupGoodTrackerRga(body).subscribe({
      next: async response => {
        console.log(response);

        if (response.rechazados > 0) {
          await this.downloadExcel(
            JSON.parse(JSON.stringify(response.bienes_rechazados)).base64File,
            'Bienes_con_errores.xlsx'
          );
        }

        this.goodsTrackerLoading = false;
        if (response.aceptados > 0) {
          this.alert(
            'success',
            `Se ingresaron ${response.aceptados} bienes`,
            ''
          );

          if (
            this.proceedingForm.get('id').value != null ||
            localStorage.getItem('idProceeding_FESTATUSRGA') != null
          ) {
            if (
              this.proceedingForm.get('id').value == null &&
              localStorage.getItem('idProceeding_FESTATUSRGA') != null
            ) {
              this.proceedingForm
                .get('id')
                .setValue(localStorage.getItem('idProceeding_FESTATUSRGA'));
              localStorage.removeItem('idProceeding_FESTATUSRGA');
            }
            this.massiveSave();
          }

          console.log(response.bienes_aceptados);
          this.numFile == null
            ? (this.numFile = response.bienes_aceptados[0].expedient)
            : '';
        }

        this.getProceedingGoods();
      },
      error: error => {
        console.log(error);
        this.goodsTrackerLoading = false;
      },
    });
  }

  async downloadExcel(base64String: any, nameFile: string) {
    const mediaType =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
    const link = document.createElement('a');
    link.href = mediaType + base64String;
    link.download = nameFile;
    link.click();
    link.remove();
  }

  hideRefusedGoods() {
    this.modalRef.hide();
  }

  insertFromGoodsTracker() {
    if (this.controls.statusProceedings.value == 'CERRADA') {
      this.alert(
        'warning',
        'Solicitud cerrada',
        'La Solicitud ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return;
    }

    /* if (!this.controls.keysProceedings.value) {
      this.alert(
        'warning',
        'Error',
        'No se ha especificado el Oficio de Solicitud'
      );
      return;
    } */

    this.conserveState = true;

    if (
      this.proceedingForm.get('id').value == null &&
      this.proceedingForm.get('statusProceedings').value == null
    ) {
      this.newProceedingFlag = true;
      localStorage.setItem('newProceedingFlag', 'S');
    } else {
      localStorage.setItem(
        'idProceeding_FESTATUSRGA',
        this.proceedingForm.get('id').value
      );
    }

    console.log(this.detailProceedingsList2.count());
    if (this.detailProceedingsList2.count() == 0) {
      console.log('Se ejecutó');
      this.cleanTmp();
    }

    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FESTATUSRGA',
      },
    });
  }

  clearFn() {
    this.cleanTmp();
    this.searched = false;
    this.queryProceeding();
    this.goodPDS1.load([]);
    this.totalItems = 0;
    this.totalItems2 = 0;
    this.totalItems3 = 0;
    this.totalItems4 = 0;
    this.totalItems5 = 0;
    this.totalItems6 = 0;
    this.params.next(new ListParams());
    this.params2.next(new ListParams());
    this.params3.next(new ListParams());
    this.params4.next(new ListParams());
    this.params5.next(new ListParams());
    this.params6.next(new ListParams());
    this.params7.next(new ListParams());
    this.params8.next(new ListParams());
  }

  newProceedingFn() {
    this.queryProceeding();
    this.newProceedingFlag = true;
  }

  save() {
    if (this.proceedingForm.get('keysProceedings').value == null) {
      this.alert('warning', 'Debe ingresar un oficio de solicitud', '');
      return;
    }

    if (this.detailProceedingsList2.count() == 0) {
      this.alert('warning', 'Debe ingresar al menos un bien', '');
      return;
    }

    if (this.proceedingForm.get('elaborationDate').value == null) {
      this.alert('warning', 'Debe especificar la Fecha de Recepción', '');
      return;
    }

    this.create();
  }

  create() {
    const body: IProccedingsDeliveryReception = {
      elaborate: this.authService.decodeToken().preferred_username,
      captureDate: this.correctDate(new Date().toString()).toISOString(),
      typeProceedings: 'RGA',
      numDelegation1: this.delegation,
      numDelegation2: this.delegation,
      statusProceedings: 'ABIERTA',
      keysProceedings: this.proceedingForm.get('keysProceedings').value,
      numFile: this.numFile,
      observations: this.proceedingForm.get('observations').value,
      datePhysicalReception: this.proceedingForm.get('datePhysicalReception')
        .value,
      closeDate: this.proceedingForm.get('closeDate').value,
      elaborationDate: new Date(),
      affair:
        this.proceedingForm.get('affair').value == ''
          ? null
          : this.proceedingForm.get('affair').value,
    };
    console.log(body);
    this.proceedingsDeliveryReceptionService.create(body).subscribe(
      res => {
        console.log(res);
        this.alert('success', 'Acta creada correctamente', '');
        this.proceedingForm.get('id').setValue(res.id);
        this.newProceedingFlag = false;
        this.massiveSave();
      },
      err => {
        console.log(err);
      }
    );
  }

  //GUARDADO DE SAVE
  massiveSave() {
    const body: ITmpCreateAuthoDestroy = {
      user: this.authService.decodeToken().preferred_username,
      proceeding: this.proceedingForm.get('id').value,
    };

    this.proceedingService.tmpCreateAuthorization(body).subscribe(
      res => {
        console.log(res);
        this.keyProceedingchange();
      },
      err => {
        this.alert('error', 'Error al crear acta', '');
        console.log(err);
      }
    );
  }

  saveDetail(numberProceedings: number | string) {
    const forms = this.detailProceedingsList
      .filter(detail => detail.numberProceedings == null)
      .map(detail => {
        const { amount, numberGood } = detail;
        return {
          amount,
          numberGood,
          numberProceedings,
        };
      });
    console.log(forms);

    const $obs = forms.map(form =>
      this.detailProceeDelRecService.addGoodToProceedings(form)
    );
    console.info($obs);

    return forkJoin($obs);
  }

  /* async update() {
    this.loading = true;
    const { id, keysProceedings } = this.controls;

    try {
      // Ejecutar ambas operaciones asincrónicas y esperar a que se completen
      await this.updateProceeding(
        id.value,
        this.proceedingForm.value
      ).toPromise();
      await this.saveDetail(id.value).toPromise();
      console.log(await this.saveDetail(id.value).toPromise());

      // Realizar acciones una vez que ambas operaciones asincrónicas se completen con éxito
      const destructionAuth: IDestructionAuth = {
        ...this.state,
        form: this.proceedingForm.value,
        trackerGoods: [],
      };
      this.store.dispatch(SetDestructionAuth({ destructionAuth }));
      this.goodTrackerGoods = [];
      this.onLoadToast('success', 'Acta actualizada correctamente');

      // Puedes seguir con otras operaciones sincrónicas aquí
      this.findProceeding(keysProceedings.value).subscribe();
      //this.getProceedingGoods();
    } catch (error) {
      // Manejar errores si alguna de las operaciones asincrónicas falla
      console.error('Error en update:', error);
    } finally {
      this.loading = false;
    }
  } */

  async scanRequestReport() {
    if (
      ['CERRADO', 'CERRADA'].includes(this.controls.statusProceedings.value)
    ) {
      this.alertQuestion(
        'warning',
        'Se reimprimirá la solicitud de digitalización',
        '¿Desea continuar?'
      ).then(result => {
        if (result.isConfirmed) {
          this.generateScanRequestReport();
        }
      });
      return;
    }

    if (this.controls.universalFolio.value != null) {
      this.alertQuestion(
        'warning',
        'La solicitud ya cuenta con un folio de escaneo',
        'se reimprime la solicitud de digitalización'
      ).then(q => {
        if (q.isConfirmed) {
          this.generateScanRequestReport();
        }
      });
      return;
    }

    if (this.detailProceedingsList2.count() == 0) {
      this.alert('warning', 'La solicitud debe tener un bien como mínimo', '');
      return;
    }

    if (this.controls.numFile.value == null) {
      this.alert(
        'warning',
        'No se tiene relación con algún expediente de un Bien',
        ''
      );
      return;
    }

    const flyerNumber = await this.getFlyerNumber(
      this.detailProceedingsList2['data'][0]['numberGood']
    );

    console.log(flyerNumber);

    if (flyerNumber == null) {
      this.alert(
        'error',
        'Error',
        'Grave al localizar la información de Volante y Expediente'
      );
      return;
    }

    this.alertQuestion(
      'question',
      'Se generará un nuevo folio de escaneo para la Solicitud abierta',
      '¿Desea continuar?'
    ).then(result => {
      const document = {
        numberProceedings: this.controls.numFile.value,
        keySeparator: '60',
        keyTypeDocument: 'RGA',
        natureDocument: 'ORIGINAL',
        descriptionDocument: `SOL.${this.controls.keysProceedings.value}`,
        significantDate: format(new Date(), 'MM-yyyy'),
        scanStatus: 'SOLICITADO',
        userRequestsScan: this.username,
        scanRequestDate: new Date(),
        numberDelegationRequested: this.delegation,
        numberSubdelegationRequests: this.subdelegation,
        numberDepartmentRequest: this.department,
      };
      this.createDocument(document);
    });
  }

  async confirmScanRequest() {
    const response = await this.alertQuestion(
      'question',
      'Aviso',
      'Se generará un nuevo folio de escaneo para la Solicitud abierta, ¿Desea continuar?'
    );

    if (!response.isConfirmed) {
      return;
    }

    console.log(this.detailProceedingsList2['data']);
    console.log(this.detailProceedingsList2['data'][0]);
    const flyerNumber = await this.getFlyerNumber(
      this.detailProceedingsList2['data'][0]['numberGood']
    );

    console.log(flyerNumber);

    if (flyerNumber == null) {
      this.alert(
        'error',
        'Error',
        'Grave al localizar la información de Volante y Expediente'
      );
      return;
    }
    const { numFile, keysProceedings } = this.controls;
    const document = {
      numberProceedings: numFile.value,
      keySeparator: '60',
      keyTypeDocument: 'RGA',
      natureDocument: 'ORIGINAL',
      descriptionDocument: `SOL.${keysProceedings.value}`,
      significantDate: format(new Date(), 'MM-yyyy'),
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.username,
      scanRequestDate: new Date(),
      numberDelegationRequested: this.delegation,
      numberSubdelegationRequests: this.subdelegation,
      numberDepartmentRequest: this.department,
    };
    this.createDocument(document);
  }

  async getFlyerNumber(number: string) {
    return new Promise((resolve, _recj) => {
      console.log('Entro a esta función');
      this.goodService.getById(number).subscribe(
        response => {
          console.log(response);
          resolve(response['data'][0]['flyerNumber']);
        },
        error => {
          console.log(error);
          resolve(null);
        }
      );
    });
  }

  createDocument(document: IDocuments) {
    this.loadingReport = true;
    this.documentsService.create(document).subscribe(
      res => {
        console.log(res);
        this.proceedingForm.get('universalFolio').setValue(res.id);
        console.log('creó documento');
        this.updateProceeding(
          this.controls.id.value,
          this.proceedingForm.value
        );
      },
      err => {
        this.alert('error', 'Error', 'Ocurrió un error al generar el folio');
      }
    );
  }

  generateScanRequestReport() {
    const params = {
      pn_folio: this.controls.universalFolio.value,
    };
    console.log('Va a descargar');
    this.downloadReport('RGERGENSOLICDIGIT', params);
  }

  downloadReport(reportName: string, params: any) {
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

  correctDateFormat(dateStr: string): string {
    if (/^\d{4}[-\/]\d{2}[-\/]\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    let parts = dateStr.split(/[-/]/);
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  updateProceeding(
    id: string | number,
    proceeding: Partial<IProccedingsDeliveryReception>
  ) {
    console.log(proceeding);
    proceeding.closeDate = new Date(
      this.correctDate(proceeding.closeDate)
    ).toString();
    proceeding.elaborationDate = new Date(
      this.correctDate(proceeding.elaborationDate)
    ).toString();

    this.proceedingsDeliveryReceptionService.update(id, proceeding).subscribe(
      async res => {
        console.log(res);
        console.log('Cargó');
        this.generateScanRequestReport();
      },
      err => {
        console.log(err);
        this.alert(
          'error',
          'No se agregó el folio de escaneo a la solicitud',
          ''
        );
      }
    );
  }

  async validateReprintReport() {
    const response = await this.alertQuestion(
      'info',
      'Info',
      'La Solicitud ya tiene folio de escaneo ¿Desea imprimir la solicitud de digitalización?'
    );
    if (response.isConfirmed) {
      this.generateScanRequestReport();
    }
  }

  printReport() {
    const { universalFolio } = this.controls;
    if (!universalFolio.value) {
      this.alert('error', 'Error', 'No tiene folio de escaneo para imprimir');
      return;
    }

    this.generateScanRequestReport();
  }

  getDictAndActs() {
    const allGoods = this.detailProceedingsList.map(detail => detail.good.id);

    // Usar mergeMap para ejecutar las solicitudes en paralelo
    return forkJoin(
      allGoods.map(arg =>
        forkJoin([this.searchActa(arg), this.searchDicta(arg)])
      )
    );
  }

  newProceeding() {
    this.queryMode = false;
    this.resetAll();
  }

  queryProceeding() {
    this.resetAll();
    this.queryMode = true;
    this.newProceedingFlag = false;
  }

  resetAll() {
    this.proceedingForm.reset();
    this.detailProceedingsList2.load([]);
    this.actaList2 = new LocalDataSource();
    this.dictaList2 = new LocalDataSource();
  }

  rechargeData() {
    let params = {
      ...this.params.getValue(),
    };

    params['filter.typeProceedings'] = `$eq:RGA`;

    this.controls.id.value != null
      ? (params['filter.id'] = `$eq:${this.controls.id.value}`)
      : (params[
          'filter.keysProceedings'
        ] = `$eq:${this.controls.keysProceedings.value}`);

    this.proceedingsDeliveryReceptionService
      .getAllProceedingsDeliveryReception2(params)
      .subscribe(
        res => {
          console.log(res);
          res.data[0].elaborationDate =
            res.data[0].elaborationDate == null
              ? null
              : new Date(res.data[0].elaborationDate);
          res.data[0].datePhysicalReception =
            res.data[0].datePhysicalReception == null
              ? null
              : this.correctDate(
                  new Date(res.data[0].datePhysicalReception).toString()
                );
          res.data[0].closeDate =
            res.data[0].closeDate == null
              ? null
              : this.correctDate(new Date(res.data[0].closeDate).toString());
          this.proceedingForm.patchValue(res.data[0]);
        },
        err => {
          console.log(err);
        }
      );
  }

  keyProceedingchange() {
    const keyProceeding = this.controls.keysProceedings.value;
    const id = this.controls.id.value;
    console.log(id);
    this.findProceeding(keyProceeding, id).subscribe();
  }

  findProceeding(keyProceeding: string, id?: string) {
    let params = {
      ...this.params.getValue(),
    };

    params['filter.typeProceedings'] = `$eq:RGA`;

    id != null
      ? (params['filter.id'] = `$eq:${id}`)
      : (params['filter.keysProceedings'] = `$eq:${keyProceeding}`);

    return this.proceedingsDeliveryReceptionService
      .getAllProceedingsDeliveryReception2(params)
      .pipe(
        catchError(error => {
          if (error.status < 500) {
            this.onLoadToast('error', 'Error', 'No existe el acta');
            this.resetAll();
          }
          if (error.status >= 500) {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al obtener el acta'
            );
          }
          return throwError(() => error);
        }),
        map(response => {
          // Primera transformación de los datos
          console.log(response.data);
          console.log(new Date(response.data[0].elaborationDate));
          return response.data;
        }),
        map(data => {
          // Segunda transformación de los datos
          return data[0];
        }),
        tap((proceeding: any) => {
          console.log(proceeding);
          proceeding.elaborationDate =
            proceeding.elaborationDate == null
              ? null
              : new Date(proceeding.elaborationDate);
          proceeding.datePhysicalReception =
            proceeding.datePhysicalReception == null
              ? null
              : this.correctDate(
                  new Date(proceeding.datePhysicalReception).toString()
                );
          proceeding.closeDate =
            proceeding.closeDate == null
              ? null
              : this.correctDate(new Date(proceeding.closeDate).toString());

          this.proceedingForm.patchValue(proceeding);
          this.searched = true;
          this.searchGoodsInDetailProceeding(proceeding.id);
          this.searchActa(proceeding.id);
          this.searchDicta(proceeding.id);
        })
      );
  }

  async scan() {
    const { universalFolio, statusProceedings } = this.controls;
    if (statusProceedings.value == 'CERRADA') {
      this.alert(
        'error',
        'Error',
        'No se puede escanear para una Solicitud cerrada'
      );
      return;
    }

    if (!universalFolio.value) {
      this.alert('error', 'Error', 'No existe folio de escaneo');
      return;
    }

    const response = await this.alertQuestion(
      'question',
      'Aviso',
      'Se abrirá la pantalla de escaneo para el folio de escaneo de la solicitud abierta. ¿Desea continuar?'
    );

    if (response.isConfirmed) {
      localStorage.setItem('idProceeding_FESTATUSRGA', this.controls.id.value);
      this.conserveState = true;
      this.router.navigate(['/pages/general-processes/scan-documents'], {
        queryParams: {
          folio: universalFolio.value,
          origin: 'FESTATUSRGA',
        },
      });
    }
  }

  closeProceedingManager() {
    if (this.controls.statusProceedings.value == 'CERRADA') {
      const body: IFestatus = {
        goodNumber: 0,
        cbApproved: '',
        vcScreen: 'FESTATUSRGA',
      };

      // this.proceedingsDeliveryReceptionService.festatus()
    } else {
      this.closeProceeding();
    }
  }

  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  closeProceeding() {
    const { closeDate, universalFolio, keysProceedings } = this.controls;
    if (!closeDate.value) {
      this.onLoadToast(
        'error',
        'Error',
        'Debe ingresar la Fecha de integración'
      );
      this.closeDate.nativeElement.focus();
      return;
    }

    if (!universalFolio.value) {
      this.onLoadToast(
        'error',
        'Error',
        'La Solicitud no tiene Folio de escaneo, no se puede cerrar'
      );
      return;
    }

    const goods = this.detailProceedingsList.filter(
      detail => detail.numberProceedings != null
    );

    if (this.detailProceedingsList2.count() == 0) {
      this.onLoadToast(
        'warning',
        'La Solicitud no tiene ningun bien asignado, no se puede cerrar',
        ''
      );
      return;
    }

    this.documentsService.getByFolio(universalFolio.value).subscribe({
      next: document => {
        if (Number(document.sheets) <= 0) {
          this.onLoadToast(
            'error',
            'Error',
            'La Solicitud no tiene Documentos escaneados, no se puede cerrar'
          );
          return;
        }
        const fecha = this.proceedingForm.get('closeDate').value;
        /* const fechaFormateada = format(
          new Date(this.correctDate(fecha)),
          'dd/MM/yyyy'
        ); */
        const message = CLOSE_PROCEEDING_MESSAGE(
          this.correctDate(fecha).toString(),
          this.totalItems2,
          keysProceedings.value
        );
        this.proceedingsDeliveryReceptionService
          .pupFillDist(this.proceedingForm.get('id').value)
          .subscribe(
            res => {
              console.log(res);
              this.openEmail(message, 'C');
            },
            err => {
              console.log(err);
              this.alert('error', 'Se presentó un error inesperado', '');
            }
          );
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al cerrar el acta'
        );
      },
    });
  }

  openEmail(message: string, action: 'C' | 'A') {
    let config: ModalOptions = {
      initialState: {
        message,
        action,
        proceeding: {
          ...this.proceedingForm.value,
          closeDate: this.correctDate(
            this.proceedingForm.get('closeDate').value
          ),
        },
        callback: (next: boolean) => {
          if (next) {
            this.keyProceedingchange();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(EmailModalComponent, config);
  }

  // -----old

  //Trae todos los bienes con estado PDS
  async getGoodByStatusPDS() {
    console.log('Dispara');
    this.loadingGoods = true;

    let params = {
      ...this.params8.getValue(),
      ...this.columnFilters,
    };

    params['filter.status'] = `$ilike:PDS`;
    this.goodService.getGoodByStatusPDS(params).subscribe({
      next: async (response: any) => {
        let result = response.data.map(async (item: any) => {
          console.log(item);
          const di_dispo = await this.goodStatus(item);
          console.log(di_dispo);
          item['di_disponible'] = di_dispo.DI_DISPONIBLE;
          item['di_acta'] =
            di_dispo.DI_ACTA != null ? di_dispo.DI_ACTA[0].cve_acta : null;
        });
        await Promise.all(result);
        this.show2 = false;
        this.goodPDS = response.data;
        this.goodPDS1.load(response.data);
        this.totalItems3 = response.count;
        this.loadingGoods = false;
      },
      error: error => (this.loadingGoods = false),
    });
  }

  searchActa(id: string | number) {
    const paramsF = new FilterParams();
    paramsF.page = this.params5.getValue().page;
    paramsF.limit = this.params5.getValue().limit;
    this.proceedingsDeliveryReceptionService
      .ProceedingsDetailActa(id, paramsF.getParams())
      .subscribe({
        next: resp => {
          this.actaList2.load(resp.data);
          this.totalItems5 = resp.count;
        },
        error: err => {},
      });
  }

  searchDicta(id: string | number) {
    const paramsF = new FilterParams();
    paramsF.page = this.params6.getValue().page;
    paramsF.limit = this.params6.getValue().limit;
    this.copiesOfficialOpinionService
      .ProceedingsDetailDicta(id, paramsF.getParams())
      .subscribe({
        next: (resp: any) => {
          this.dictaList2.load(resp.data);
          this.totalItems6 = resp.count;
        },
        error: (err: any) => {},
      });
  }

  cleanTmp() {
    const proceeding = '-1';
    const paramsF = new FilterParams();
    this.proceedingService
      .tmpAuthorizationsDestruction(this.user, proceeding, paramsF.getParams())
      .subscribe(
        res => {
          // this.canNewProceeding = true;
          console.log(res);
          this.data.load([]);
        },
        err => {
          if (err.status != 400) {
            this.alert(
              'warning',
              'Hubo un problema limpiando la tabla temporal',
              ''
            );
          }
        }
      );
  }

  getProceedingGoods() {
    // this.canSearch = false;
    this.loading = true;
    const paramsF = new FilterParams();
    paramsF.page = this.params7.getValue().page;
    paramsF.limit = this.params7.getValue().limit;
    this.proceedingService
      .tmpAuthorizationsDestruction(this.user, null, paramsF.getParams())
      .subscribe(
        res => {
          const newData = res.data.map((item: any) => {
            return {
              ...item,
              /* cve_proceeding:
                item.available == 'N' ? this.cve_proceeding : null,
              date_proceeding:
                item.available == 'N'
                  ? format(this.correctDate(this.date_proceeding), 'dd/MM/yyyy')
                  : null, */
            };
          });

          if (this.numFile == null) {
            this.numFile = res.data[0].expedient;
          }

          console.log(newData);
          this.detailProceedingsList2.load(newData);
          this.totalItems2 = res.count;
          this.loading = false;
          // this.consult = true;
        },
        err => {
          this.detailProceedingsList2.load([]);
          console.log(err);
          this.alert('warning', 'No se encontrarón registros', '');
          // this.canSearch = true;
          this.loading = false;
        }
      );
  }

  //StatusBien
  async goodStatus(item: any): Promise<any> {
    return new Promise<string>((resolve, reject) => {
      const body: IAvailableFestatus = {
        goodId: item.id,
        status: item.status,
        screenkey: 'FESTATUSRGA',
      };

      this.proceedingService.getAvailableFestatus(body).subscribe(
        res => {
          resolve(res);
        },
        err => resolve(err)
      );
    });
  }

  onFileChange(event: Event) {
    if (
      ['CERRADO', 'CERRADA'].includes(this.controls.statusProceedings.value)
    ) {
      this.alert(
        'warning',
        'Acta cerrada',
        'La Solicitud ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return;
    }

    if (
      this.controls.id.value == null ||
      this.controls.statusProceedings.value == null
    ) {
      this.alert(
        'warning',
        'Debe ingresar un acta',
        'No se puede agregar bienes por archivo plano sin un acta'
      );
      return;
    }

    this.flatGoodFlag = true;
    const files = (event.target as HTMLInputElement).files[0];
    let formData = new FormData();
    formData.append('file', files);
    formData.append('user', this.user);
    formData.append('proceedingNumber', this.controls.id.value);
    this.getDataFile(formData);
  }

  getDataFile(data: any) {
    if (this.detailProceedingsList2.count() == 0) {
      this.cleanTmp();
    }

    this.massiveGoodService.newPupFlatGoods(data).subscribe({
      next: resp => {
        this.alert('info', '', `${resp.aceptados}, ${resp.rechazados}`);
        this.flatGoodFlag = false;
        this.getProceedingGoods();
        this.massiveSave();
        console.log(resp);
        if (this.goodPDS1.count() > 0) {
          this.getGoodByStatusPDS();
        }
      },
      error: err => {
        console.log(err);
        this.flatGoodFlag = false;
        this.alert('error', 'Ocurrió un error al leer el archivo', '');
      },
    });
  }

  insertGood() {
    if (
      ['CERRADO', 'CERRADA'].includes(this.controls.statusProceedings.value)
    ) {
      this.alert(
        'warning',
        'Error',
        'La Solicitud ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return;
    }

    if (this.selectGoodGen == null) {
      this.alert('warning', 'Debe seleccionar un Bien', '');
      return;
    }

    if (this.selectGoodGen.di_disponible != 'S') {
      this.alert(
        'warning',
        'El Bien no está disponible',
        'El bien no está disponible para ser agregado'
      );
      return;
    }

    if (!this.proceedingForm.get('id').value) {
      this.alert('warning', 'Es necesario contar con el No. de Acta', '');
      return;
    }

    let body = {
      pVcScreem: 'FESTATUSRGA',
      pActaNumber: this.proceedingForm.get('id').value,
      pStatusActa: this.proceedingForm.get('statusProceedings').value,
      pGoodNumber: this.selectGoodGen.id,
      pDiAvailable: '',
      pDiActa: this.selectGoodGen.requestFolio,
      pCveActa: this.proceedingForm.get('keysProceedings').value,
      pAmount: this.selectGoodGen.quantity,
    };
    this.massiveGoodService.InsertGood(body).subscribe({
      next: data => {
        console.log(data);
        this.alert('success', 'Bien insertado', '');
        // this.getProceedingGoods();
        this.searchGoodsInDetailProceeding(this.proceedingForm.get('id').value);
        this.getGoodByStatusPDS();
      },
      error: err => {
        console.log(err);
        this.alert(
          'warning',
          `El Bien: ${this.selectGoodGen.id}, ya ha sido ingresado en una solicitud o presenta un error`,
          ''
        ); // Asumiendo que 'alert' se encarga de mostrar la alerta
        this.array = [...this.tempArray];
      },
    });
  }

  //AGREGADO POR GRIGORK
  async validateFolio() {
    return new Promise((resolve, reject) => {
      this.documentsService
        .getByFolio(this.proceedingForm.get('universalFolio').value)
        .subscribe(
          res => {
            const data = JSON.parse(JSON.stringify(res));
            const scanStatus = data.data[0]['scanStatus'];
            console.log(scanStatus);
            if (scanStatus === 'ESCANEADO') {
              resolve(true);
            } else {
              resolve(false);
            }
          },
          err => {
            resolve(false);
          }
        );
    });
  }

  async newCloseProceeding() {
    if (this.proceedingForm.get('closeDate').value == null) {
      this.alert('warning', 'Debe ingresar la fecha de integración', '');
      return;
    }

    if (this.detailProceedingsList2.count() == 0) {
      this.alert(
        'warning',
        'La Solicitud no tiene ningun bien asignado, no se puede cerrar.',
        ''
      );
      return;
    }

    if (this.proceedingForm.get('universalFolio').value == null) {
      this.alert(
        'warning',
        'La solicitud no tiene folio de escaneo, no se puede cerrar',
        ''
      );
      return;
    }

    const scanStatus = await this.validateFolio();

    if (!scanStatus) {
      this.alert(
        'warning',
        'La solicitud no tiene documentos escaneados, no se puede cerrar',
        ''
      );
      return;
    }

    console.log(this.goodsAct);
  }

  //SELECT GOOD ACTA
  selectGoodGeneral(good: any) {
    console.log(good);
    this.selectGoodGen = good.data;
  }

  //SELECT GOOD ACTA
  selectGoodActa(good: any) {
    console.log(good);
    this.selectGoodProc = good.data;
  }

  //AGREGAR BIENES DE RASTREADOR LOCAL
  fillLocalDataTracker(ngGlobal: string) {
    const paramsF = new FilterParams();
    paramsF.addFilter('identificator', ngGlobal);
    this.goodTrackerService
      .getAllTmpTracker(paramsF.getParams())
      .subscribe(res => {
        console.log(res);
        this.loading = true;
        let count = 0;
        res['data'].forEach(good => {
          count = count + 1;
          this.goodServices.getById(good.goodNumber).subscribe({
            next: response => {
              console.log(response);
              const respJson = JSON.parse(JSON.stringify(response)).data[0];
              const newGoodId = JSON.parse(JSON.stringify(response)).data[0]
                .goodId;

              const exists = this.dataGoods.some(e => e.goodId === newGoodId);
              console.log(exists);
              if (!exists) {
                this.dataGoods.push({
                  ...JSON.parse(JSON.stringify(response)).data[0],
                  avalaible: null,
                });
              }

              this.detailProceedingsList2.refresh();
              this.detailProceedingsList2.load(respJson);
              /* this.validGood(JSON.parse(JSON.stringify(response)).data[0]); */ //!SE TIENE QUE REVISAR
            },
            error: err => {
              console.log(err);
            },
          });
          if (count === res['data'].length) {
            this.loading = false;
          }
        });
      });
  }

  //DATOS DE LA TABLA TEMPORAL
  searchGoodsInDetailProceeding(idProceeding: string) {
    // this.canSearch = false; //ver si necesita
    this.loading = true;
    const paramsF = new FilterParams();
    const proceeding = idProceeding;
    paramsF.page = this.params.getValue().page;
    paramsF.limit = this.params.getValue().limit;
    this.proceedingService
      .tmpAuthorizationsDestruction(this.user, proceeding, paramsF.getParams())
      .subscribe(
        res => {
          const newData = res.data.map((item: any) => {
            return {
              ...item,
              /*  cve_proceeding:
                item.available == 'N' ? this.cve_proceeding : null,
              date_proceeding:
                item.available == 'N'
                  ? format(this.correctDate(this.date_proceeding), 'dd/MM/yyyy')
                  : null, */
            };
          });

          if (this.numFile == null) {
            this.numFile = res.data[0].expedient;
          }

          this.detailProceedingsList2.load(newData);
          this.totalItems2 = res.count;
          this.loading = false;
          // this.consult = true;
        },
        err => {
          this.detailProceedingsList2.load([]);
          console.log(err);
          this.totalItems2 = 0;
          // this.canSearch = true;
          this.loading = false;
        }
      );
  }

  //GUARDAR DATOS DEL ACTA
}
