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
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { maxDate } from 'src/app/common/validations/date.validators';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGoodService } from 'src/app/core/services/ms-dictation/dictation-x-good.service';
import { CopiesOfficialOpinionService } from 'src/app/core/services/ms-dictation/ms-copies-official-opinion.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
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
import {
  ResetDestructionAuth,
  SetDestructionAuth,
} from './store/destruction-auth.actions';
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
  array: any = [];
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
    id: [null, []],
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
    private copiesOfficialOpinionService: CopiesOfficialOpinionService
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
      ...this.settings2,
      actions: false,
      columns: {
        ...DETAIL_PROCEEDINGS_DELIVERY_RECEPTION,
        selection: {
          title: '',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectGood(instance),
          filter: false,
          sort: false,
        },
      },
      hideSubHeader: false,
    };

    this.settings3 = {
      //Bienes en estatus PDS
      ...this.settings3,
      actions: false,
      columns: {
        ...GOODS_COLUMNS,
        selection: {
          title: '',
          sort: false,
          type: 'custom',
          filter: false,
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectGoodPSD(instance),
        },
      },
      hideSubHeader: false,
      rowClassFunction: (row: any) => {
        const di_disponible = row.data.di_disponible;
        console.log(row.data);

        if (di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };

    this.settings4 = {
      //Actas de recepción
      ...this.settings4,
      actions: false,
      columns: { ...ACTA_RECEPTION_COLUMNS },
      hideSubHeader: false,
    };

    this.settings5 = {
      //dictaminaciones
      ...this.settings5,
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

  onSelectGood(instance: CheckboxElementComponent) {
    if (this.controls.statusProceedings.value == 'CERRADA') {
      instance.disabled = true;
    }
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.selectGood(data.row, data.toggle),
    });
  }

  private tempArray: any[] = [];
  onSelectGoodPSD(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        this.selectGoodPSD(data.row.goodId, data.toggle);

        this.tempArray = [...this.array];

        if (data.toggle) {
          // Si el checkbox se selecciona, agregar el elemento al array
          if (!this.array.includes(data.row.goodId)) {
            this.array.push(data.row.goodId);
          }
        } else {
          // Si el checkbox se deselecciona, eliminar el elemento del array
          const index = this.array.indexOf(data.row.goodId);
          if (index !== -1) {
            this.array.splice(index, 1);
          }
        }
      },
    });
  }

  deleteGood() {
    const { id } = this.controls;
    if (!this.controls.keysProceedings.value) {
      this.alert(
        'warning',
        'Error',
        'Debe especificar/buscar la Solicitud para despues eliminar el bien de esta'
      );
      return;
    }

    if (this.controls.statusProceedings.value == 'CERRADA') {
      this.alert(
        'warning',
        'Error',
        'La Solicitud ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return;
    }

    if (this.selectedGoods.length == 0) {
      this.alert(
        'warning',
        'Error',
        'Debe seleccionar un bien que forme parte de la Solicitud primero'
      );
      return;
    }

    const offlineGoods = this.selectedGoods.filter(
      detail => !detail.numberProceedings
    );
    const onlineGoods = this.selectedGoods.filter(
      detail => detail.numberProceedings != null
    );
    offlineGoods.forEach(detail => {
      this.detailProceedingsList = this.detailProceedingsList.filter(
        _d => _d.numberGood != detail.numberGood
      );
      this.selectedGoods = this.selectedGoods.filter(
        _d => _d.numberGood != detail.numberGood
      );
      this.goodTrackerGoods = this.goodTrackerGoods.filter(
        _d => _d.numberGood != detail.numberGood
      );
    });
    if (onlineGoods.length == 0 && offlineGoods.length > 0) {
      this.onLoadToast('success', 'Bienes eliminados del acta');
    }
    if (onlineGoods.length == 0) {
      return;
    }
    this.loadingGoodsByP = true;
    const $obs = onlineGoods.map(detail => this.deleteDetail(detail));
    forkJoin($obs).subscribe({
      next: () => {
        this.loadingGoodsByP = false;

        this.onLoadToast('success', 'Bienes eliminados del acta');

        this.getProceedingGoods(id.value);
      },
      error: () => {
        this.loadingGoodsByP = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al eliminar los bienes del acta'
        );
        this.getProceedingGoods(id.value);
      },
    });
  }

  deleteDetail(detail: IDetailProceedingsDeliveryReception) {
    return this.detailProceeDelRecService.remove(
      detail.numberGood,
      detail.numberProceedings
    );
  }

  selectGood(good: IDetailProceedingsDeliveryReception, selected: boolean) {
    if (selected) {
      this.selectedGoods.push(good);
    } else {
      this.selectedGoods = this.selectedGoods.filter(
        _detail => _detail.good.id != good.good.id
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
      this.getProceedingGoods(id.value);
      this.searchActa(id.value);
      this.searchDicta(id.value);
    });
  }

  ngOnInit(): void {
    this.queryMode = false;
    this.getUserInfo();
    this.conserveState = false;
    this.$unSubscribe.subscribe({
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
    });
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
            this.insertDetailFromGoodsTracker();
            this.getDictAndActs().subscribe();
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
    this.params8
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByStatusPDS());
  }

  setExpedientNum(goodId: number | string) {
    const params = new FilterParams();
    params.addFilter('id', goodId);
    this.goodService.getAllFilter(params.getParams()).subscribe(good => {
      this.controls.numFile.setValue(good.data[0].fileNumber);
    });
  }

  insertDetailFromGoodsTracker() {
    const body = {
      keyAct: this.controls.keysProceedings.value,
      statusAct: 'RGA',
      goodNumber: this.ngGlobal.REL_BIENES,
    };
    this.goodsTrackerLoading = true;
    this.massiveGoodService.goodTracker(body).subscribe({
      next: response => {
        const goods = response.bienes_aceptados.map(good => {
          return {
            numberGood: Number(good.goodNumber),
            good: {
              id: Number(good.goodNumber),
              description: good.description,
            },
            amount: Number(good.amount),
            numberProceedings: null,
          };
        });
        if (
          response.bienes_aceptados.length > 0 &&
          !this.controls.numFile.value
        ) {
          this.setExpedientNum(response.bienes_aceptados[0].goodNumber);
        }
        this.goodTrackerGoods = [
          ...new Set([...this.goodTrackerGoods, ...goods]),
        ];
        this.detailProceedingsList = [
          ...this.goodTrackerGoods,
          ...this.detailProceedingsList,
        ];
        this.refusedGoods = response.bienes_rechazados;
        this.goodsTrackerLoading = false;
        let message = `<p>Se ingresaron <b>${response.aceptados}</b> bienes</p>`;
        if (response.rechazados > 0) {
          message += `<p>Se rechazaron <b>${response.rechazados}</b> bienes</p>`;
        }
        this.alert('info', 'Info', null, message);
        this.keyProceedingchange();
        this.getDictAndActs().subscribe(result => {
          // Manejar los datos de result aquí
          console.log(result);
        });

        console.log(this.getDictAndActs());

        if (response.rechazados > 0) {
          const modalConfig = {
            ...MODAL_CONFIG,
            class: 'modal-dialog-centered',
          };
          this.modalRef = this.modalService.show(this.modal, modalConfig);
        }
      },
      error: () => {
        this.goodsTrackerLoading = false;
        this.getDictAndActs().subscribe(result => {
          // Manejar los datos de result aquí
          console.log(result);
        });
      },
    });
  }

  insertDetailFromOn() {
    let dato: string = '';
    dato = this.array[0];

    const body = {
      keyAct: this.controls.keysProceedings.value,
      statusAct: 'RGA',
      goodNumber: dato,
    };
    this.goodsTrackerLoading = true;
    this.massiveGoodService.goodTracker(body).subscribe({
      next: response => {
        const goods = response.bienes_aceptados.map(good => {
          return {
            numberGood: Number(good.goodNumber),
            good: {
              id: Number(good.goodNumber),
              description: good.description,
            },
            amount: Number(good.amount),
            numberProceedings: null,
          };
        });
        if (
          response.bienes_aceptados.length > 0 &&
          !this.controls.numFile.value
        ) {
          this.setExpedientNum(response.bienes_aceptados[0].goodNumber);
        }
        this.goodTrackerGoods = [
          ...new Set([...this.goodTrackerGoods, ...goods]),
        ];
        this.detailProceedingsList = [
          ...this.goodTrackerGoods,
          ...this.detailProceedingsList,
        ];
        this.refusedGoods = response.bienes_rechazados;
        this.goodsTrackerLoading = false;
        let message = `<p>Se ingresaron <b>${response.aceptados}</b> bienes</p>`;
        if (response.rechazados > 0) {
          message += `<p>Se rechazaron <b>${response.rechazados}</b> bienes</p>`;
        }
        this.alert('info', 'Info', null, message);

        this.getDictAndActs().subscribe();
        if (response.rechazados > 0) {
          const modalConfig = {
            ...MODAL_CONFIG,
            class: 'modal-dialog-centered',
          };
          this.modalRef = this.modalService.show(this.modal, modalConfig);
        }
      },
      error: () => {
        this.goodsTrackerLoading = false;
      },
    });
  }

  hideRefusedGoods() {
    this.modalRef.hide();
  }

  insertFromGoodsTracker() {
    if (this.controls.statusProceedings.value == 'CERRADA') {
      this.alert('warning', 'Error', 'La Solicitud ya esta cerrada');
      return;
    }

    if (!this.controls.keysProceedings.value) {
      this.alert(
        'warning',
        'Error',
        'No se ha especificado el Oficio de Solicitud'
      );
      return;
    }

    this.conserveState = true;
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FESTATUSRGA',
      },
    });
  }

  save() {
    if (!this.proceedingForm.valid) {
      this.onLoadToast('error', 'Error', 'El formulario es invalido');
      return;
    }

    if (!this.controls.numFile.value) {
      this.onLoadToast('error', 'Error', 'Debe ingresar al menos un bien');
      return;
    }

    if (!this.controls.id.value) {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    const defaultData = {
      elaborate: this.username,
      captureDate: new Date(),
      typeProceedings: 'RGA',
      numDelegation1: this.delegation,
      numDelegation2: this.delegation,
    };
    if (!this.controls.statusProceedings.value) {
      this.controls.statusProceedings.setValue('ABIERTA');
    }
    this.proceedingForm.patchValue(defaultData);
    this.loading = true;
    this.proceedingsDeliveryReceptionService
      .create(this.proceedingForm.value)
      .pipe(
        switchMap(proceeding =>
          this.saveDetail(proceeding.id).pipe(map(() => proceeding))
        )
      )
      .subscribe({
        next: proceeding => {
          const destructionAuth: IDestructionAuth = {
            ...this.state,
            form: this.proceedingForm.value,
            trackerGoods: [],
          };
          this.store.dispatch(SetDestructionAuth({ destructionAuth }));
          this.goodTrackerGoods = [];
          this.loading = false;
          this.proceedingForm.patchValue(proceeding);
          this.getProceedingGoods(proceeding.id);
          this.onLoadToast('success', 'Acta generada correctamente', '');
        },
        error: error => {
          this.loading = false;
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al guardar el acta'
          );
        },
      });
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
    const $obs = forms.map(form =>
      this.detailProceeDelRecService.addGoodToProceedings(form)
    );
    return forkJoin($obs);
  }

  update() {
    this.loading = true;
    const { id, keysProceedings } = this.controls;
    forkJoin([
      this.updateProceeding(id.value, this.proceedingForm.value),
      this.saveDetail(id.value),
    ]).subscribe({
      next: () => {
        const destructionAuth: IDestructionAuth = {
          ...this.state,
          form: this.proceedingForm.value,
          trackerGoods: [],
        };
        this.store.dispatch(SetDestructionAuth({ destructionAuth }));
        this.loading = false;
        this.goodTrackerGoods = [];
        this.onLoadToast('success', 'Acta actualizada correctamente');
        this.findProceeding(keysProceedings.value).subscribe();
        this.getProceedingGoods(id.value);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async scanRequest() {
    const { statusProceedings, universalFolio, numFile, id } = this.controls;
    const status = statusProceedings.value;
    const folio = universalFolio.value;
    const expedient = numFile.value;
    if (!id.value) {
      this.alert('warning', 'No hay un acta guardada aún', '');
      return;
    }

    if (status == 'CERRADA' || !status) {
      this.alert(
        'warning',
        'Error',
        'No se puede generar el folio de escaneo en una Solicitud ya cerrada o clave inválida'
      );
      return;
    }

    if (folio) {
      await this.validateReprintReport();
      return;
    }

    if (!expedient) {
      this.alert(
        'error',
        'Error',
        'No se tiene relación con algún expediente de un Bien'
      );
      return;
    }

    if (this.detailProceedingsList.length == 0) {
      this.alert(
        'error',
        'Error',
        'La solicitud debe tener un Bien como mínimo'
      );
      return;
    }
    await this.confirmScanRequest();
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

    const flyerNumber = this.detailProceedingsList[0].good.flyerNumber;

    if (!flyerNumber) {
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
      flyerNumber,
    };
    this.createDocument(document)
      .pipe(
        tap(_document => this.controls.universalFolio.setValue(_document.id)),
        switchMap(_document => {
          const id = this.controls.id.value;
          return this.updateProceeding(id, this.proceedingForm.value).pipe(
            map(() => _document)
          );
        }),
        switchMap(_document => this.generateScanRequestReport())
      )
      .subscribe();
  }

  createDocument(document: IDocuments) {
    this.loadingReport = true;
    return this.documentsService.create(document).pipe(
      tap(_document => {
        this.loadingReport = false;
      }),
      catchError(error => {
        this.loadingReport = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al general el documento'
        );
        return throwError(() => error);
      })
    );
  }

  generateScanRequestReport() {
    const pn_folio = this.controls.universalFolio.value;
    return this.siabService.fetchReport('RGERGENSOLICDIGIT', { pn_folio }).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      tap(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      })
    );
  }

  updateProceeding(
    id: string | number,
    proceeding: Partial<IProccedingsDeliveryReception>
  ) {
    return this.proceedingsDeliveryReceptionService.update(id, proceeding).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al actualizar el acta'
        );
        return throwError(() => error);
      })
    );
  }

  async validateReprintReport() {
    const response = await this.alertQuestion(
      'info',
      'Info',
      'La Solicitud ya tiene folio de escaneo ¿Desea imprimir la solicitud de digitalización?'
    );
    if (response.isConfirmed) {
      this.generateScanRequestReport().subscribe();
    }
  }

  printReport() {
    const { universalFolio } = this.controls;
    if (!universalFolio.value) {
      this.alert('error', 'Error', 'No tiene folio de escaneo para imprimir');
      return;
    }

    //this.generateScanRequestReport().subscribe();
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
  }

  resetAll() {
    this.proceedingForm.reset();
    this.detailProceedingsList = [];
    this.actaList = [];
    this.dictaList = [];
  }

  keyProceedingchange() {
    const keyProceeding = this.controls.keysProceedings.value;

    this.findProceeding(keyProceeding).subscribe();
  }

  findProceeding(keyProceeding: string) {
    let params = {
      ...this.params.getValue(),
    };

    params['filter.typeProceedings'] = `$ilike:RGA`;

    params['filter.keysProceedings'] = `$ilike:${keyProceeding}`;

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
        map(response => response.data[0]),
        tap((proceeding: any) => {
          proceeding.elaborationDate = moment(
            proceeding.elaborationDate
          ).format('DD/MM/YYYY');
          proceeding.datePhysicalReception = moment(
            proceeding.datePhysicalReception
          ).format('DD/MM/YYYY');
          proceeding.closeDate = moment(proceeding.closeDate).format(
            'DD/MM/YYYY'
          );

          this.proceedingForm.patchValue(proceeding);
          this.getProceedingGoods(proceeding.id);
          this.searchActa(proceeding.id);
          this.searchDicta(proceeding.id);
        })
        // switchMap(proceeding => {
        //   const getGoods$ = this.getProceedingGoods(proceeding.id);
        //   const searchActa$ = this.searchActa(proceeding.id);
        //   const searchDicta$ = this.searchDicta(proceeding.id);

        //   return forkJoin([getGoods$, searchActa$, searchDicta$]);
        // })
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
      this.conserveState = true;
      this.router.navigate(['/pages/general-processes/scan-documents'], {
        queryParams: {
          folio: universalFolio.value,
          origin: 'FESTATUSRGA',
        },
      });
    }
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

    if (goods.length == 0) {
      this.onLoadToast(
        'error',
        'Error',
        'La Solicitud no tiene ningun bien asignado, no se puede cerrar'
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
        const fechaFormateada = this.datePipe.transform(fecha, 'dd/MM/yyyy');
        const message = CLOSE_PROCEEDING_MESSAGE(
          fechaFormateada,
          this.totalItems2,
          keysProceedings.value
        );
        this.openEmail(message, 'C');
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
        proceeding: this.proceedingForm.value,
        callback: (next: boolean) => {
          if (next) {
            const id = this.controls.keysProceedings.value;
            this.findProceeding(id).subscribe();
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
    this.loadingGoods = true;

    let params = {
      ...this.params8.getValue(),
      ...this.columnFilters,
    };

    params['filter.status'] = `$ilike:PDS`;
    this.goodService.getGoodByStatusPDS(params).subscribe({
      next: async (response: any) => {
        let result = response.data.map(async (item: any) => {
          let obj = {
            vcScreen: 'FESTATUSRGA',
            goodNumber: item.id,
          };

          const di_dispo = await this.goodStatus(obj);
          item['di_disponible'] = di_dispo;
          console.log(item['di_disponible']);
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
    let params = {
      ...this.params5.getValue(),
    };
    this.proceedingsDeliveryReceptionService
      .ProceedingsDetailActa(id, params)
      .subscribe({
        next: resp => {
          this.actaList2.load(resp.data);
          this.totalItems5 = resp.count;
        },
        error: err => {},
      });
  }

  searchDicta(id: string | number) {
    let params = {
      ...this.params6.getValue(),
    };
    this.copiesOfficialOpinionService
      .ProceedingsDetailDicta(id, params)
      .subscribe({
        next: (resp: any) => {
          this.dictaList2.load(resp.data);
          this.totalItems6 = resp.count;
        },
        error: (err: any) => {},
      });
  }

  getProceedingGoods(proceedingId: number | string) {
    this.loadingGoodsByP = true;
    let params = {
      ...this.params2.getValue(),
    };
    this.detailProceeDelRecService
      .getGoodsByProceedings(proceedingId, params)
      .subscribe({
        next: resp => {
          this.detailProceedingsList = resp.data;
          this.detailProceedingsList2.load(resp.data);
          this.totalItems2 = resp.count;
          this.loadingGoodsByP = false;
          this.goodTrackerGoods;
        },
        error: err => {
          this.loadingGoodsByP = false;
        },
      });
  }

  //StatusBien
  async goodStatus(id: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.goodprocessService.getScreenGood2(id).subscribe({
        next: async (response: any) => {
          if (response.data) {
            resolve('S');
          } else {
            resolve('N');
          }
        },
        error: () => {
          resolve('N');
        },
      });
    });
  }
}
