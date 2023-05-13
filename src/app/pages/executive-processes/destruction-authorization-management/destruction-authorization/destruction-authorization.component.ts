import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
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
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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

  $state = this.store.select(getDestructionAuth);
  state: IDestructionAuth;

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  params5 = new BehaviorSubject<ListParams>(new ListParams());

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

  settings2;
  settings3;
  settings4;
  settings5;

  rowSelected: boolean = false;
  selectedRow: any = null;

  data: LocalDataSource = new LocalDataSource();
  actaList: { cve_acta: string }[] = [];

  loadingProceedings = false;
  loadingGoods = false;
  loadingGoodsByP = false;
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

  @ViewChild('focusElement', { static: true })
  focusElement: ElementRef<HTMLInputElement>;

  @ViewChild('closeDate', { static: true })
  closeDate: ElementRef<HTMLInputElement>;

  queryMode = false;

  goodTrackerGoods: IDetailProceedingsDeliveryReception[] = [];
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
    private siabService: SiabService
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
    };

    this.settings2 = {
      //Bienes por actas
      ...this.settings,
      actions: false,
      columns: { ...DETAIL_PROCEEDINGS_DELIVERY_RECEPTION },
    };

    this.settings3 = {
      //Bienes en estatus PDS
      ...this.settings,
      actions: false,
      columns: { ...GOODS_COLUMNS },
    };

    this.settings4 = {
      //Actas de recepción
      ...this.settings,
      actions: false,
      columns: { ...ACTA_RECEPTION_COLUMNS },
    };

    this.settings5 = {
      //dictaminaciones
      ...this.settings,
      actions: false,
      columns: { ...DICTATION_COLUMNS },
    };
    console.log('constructor');
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
      const { form } = this.state;
      this.proceedingForm.patchValue(form);
      const { id } = this.controls;
      if (!id.value) {
        return;
      }
      this.getProceedingGoods(id.value).subscribe();
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
        };
        this.store.dispatch(SetDestructionAuth({ destructionAuth }));
      },
    });
    this.show = true;
    this.show2 = true;
    this.filterParams2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodByStatusPDS());
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.setState();
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES) {
            this.insertDetailFromGoodsTracker();
          }
        },
      });
  }

  insertDetailFromGoodsTracker() {
    const mockGoods: any = [
      {
        numberGood: 4005331,
        good: { id: 4005331, description: 'Bien de prueba', expedient: 783558 },
        amount: 1,
        expedient: 783558,
        numberProceedings: null,
        approved: 'NO',
      },
    ];
    mockGoods.forEach((good: any) => {
      // TODO: checar si el campo vendra asi en la respuesta
      if (!this.controls.numFile.value) {
        console.log('entro a la validacion', good.expedient);
        this.controls.numFile.setValue(good.expedient);
        console.info(this.controls.numFile);
      }
    });
    this.goodTrackerGoods = mockGoods;
    this.detailProceedingsList = [...mockGoods, ...this.detailProceedingsList];
    console.log(this.detailProceedingsList);
    this.getDictAndActs().subscribe();
  }

  insertFromGoodsTracker() {
    if (this.controls.statusProceedings.value == 'CERRADA') {
      this.onLoadToast('error', 'Error', 'La Solicitud ya esta cerrada');
      return;
    }

    if (!this.controls.keysProceedings.value) {
      this.onLoadToast(
        'error',
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
    console.log(this.proceedingForm.value);
    if (!this.proceedingForm.valid) {
      this.onLoadToast('error', 'Error', 'El formulario es invalido');
      return;
    }

    if (!this.controls.numFile.value) {
      this.onLoadToast('error', 'Error', 'Debe ingresar al menos un Bien');
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
          this.goodTrackerGoods = [];
          this.loading = false;
          this.proceedingForm.patchValue(proceeding);
          this.getProceedingGoods(proceeding.id).subscribe();
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
        this.loading = false;
        this.goodTrackerGoods = [];
        this.onLoadToast('success', 'Acta actualizada correctamente');
        this.findProceeding(keysProceedings.value).subscribe();
        this.getProceedingGoods(id.value).subscribe();
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
      this.alert('error', 'Error', 'No hay un acta guardado aún');
      return;
    }
    if (status == 'CERRADA' || !status) {
      this.alert(
        'error',
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

    this.generateScanRequestReport().subscribe();
  }

  getProceedingGoods(proceedingId: number | string) {
    this.loadingGoodsByP = true;
    return this.detailProceeDelRecService
      .getGoodsByProceedings(proceedingId, this.params2.getValue())
      .pipe(
        catchError(error => {
          this.detailProceedingsList = [];
          this.totalItems2 = 0;
          this.loadingGoodsByP = false;
          if (error.status >= 500) {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrió un error al consultar los bienes relacionados al acta'
            );
          }
          return throwError(() => error);
        }),
        tap(response => {
          this.detailProceedingsList = [
            ...this.goodTrackerGoods,
            ...response.data,
          ];
          this.totalItems2 = response.count;
          this.loadingGoodsByP = false;
        }),
        switchMap(() => this.getDictAndActs())
      );
  }

  getDictAndActs() {
    console.log(this.goodTrackerGoods);
    console.log(this.detailProceedingsList);
    const trackerGoodNumbers = this.goodTrackerGoods.map(
      detail => detail.good.id
    );
    const goodNumbers = this.detailProceedingsList.map(
      detail => detail.good.id
    );

    const allGoods = [...trackerGoodNumbers, ...goodNumbers];
    return forkJoin([this.getDicts(allGoods), this.getActs(allGoods)]);
  }

  getActs(goodNumbers: number[]) {
    return this.dictationXGoodService.getByAct(goodNumbers).pipe(
      catchError(error => {
        if (error.status >= 500) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al obtener las actas de recepci+on'
          );
        }
        return throwError(() => error);
      }),
      tap(response => {
        this.actaList = response.data;
      })
    );
  }

  getDicts(goodNumbers: number[]) {
    return this.dictationXGoodService.getByDictation(goodNumbers).pipe(
      catchError(error => {
        if (error.status >= 500) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al obtener las dictaminaciones'
          );
        }
        return throwError(() => error);
      }),
      tap(response => {
        this.dictaList = response.data;
      })
    );
  }

  newProceeding() {
    this.queryMode = false;
    this.resetAll();
  }

  queryProceeding() {
    this.resetAll();
    this.focusElement.nativeElement.focus();
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
    if (!this.queryMode) {
      return;
    }
    if (!keyProceeding) {
      return;
    }

    this.findProceeding(keyProceeding).subscribe();
  }

  findProceeding(keyProceeding: string) {
    const params = new FilterParams();
    params.addFilter('typeProceedings', 'RGA');
    params.addFilter('keysProceedings', keyProceeding);
    return this.proceedingsDeliveryReceptionService
      .getAllProceedingsDeliveryReception(params.getParams())
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
        tap((proceeding: any) => this.proceedingForm.patchValue(proceeding)),
        switchMap(proceeding => this.getProceedingGoods(proceeding.id))
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

        const message = CLOSE_PROCEEDING_MESSAGE(
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
  getGoodByStatusPDS() {
    if (this.show2) this.filterParams2.getValue().removeAllFilters();
    this.filterField2();
    this.loadingGoods = true;
    this.goodService
      .getGoodByStatusPDS(this.filterParams2.getValue().getParams())
      .subscribe({
        next: response => {
          this.show2 = false;
          this.goodPDS = response.data;
          this.totalItems3 = response.count;
          this.loadingGoods = false;
        },
        error: error => (this.loadingGoods = false),
      });
  }

  filterField2() {
    this.filterParams2.getValue().addFilter('status', 'PDS');
  }
}
