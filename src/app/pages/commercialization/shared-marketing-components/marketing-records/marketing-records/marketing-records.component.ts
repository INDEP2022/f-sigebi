import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  skip,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IAttachedDocument } from 'src/app/core/models/ms-documents/attached-document.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IGoodJobManagement } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { CopiesJobManagementService } from 'src/app/core/services/ms-office-management/copies-job-management.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AddDocsComponent } from '../add-docs/add-docs.component';
import { CppForm } from '../utils/cpp-form';
import { MarketingRecordsForm } from '../utils/marketing-records-form';
import { COLUMNS, COLUMNS2 } from './columns';
import { DocsData, GoodsData } from './data';

@Component({
  selector: 'app-marketing-records',
  templateUrl: './marketing-records.component.html',
  styles: [],
})
export class MarketingRecordsComponent extends BasePage implements OnInit {
  showJuridic: boolean = false;
  problematicRadios = new FormControl<1 | 2>(null);
  officeTypeCtrl = new FormControl<'ENT' | 'ESC'>(null);
  form = new FormGroup(new MarketingRecordsForm());
  documents: IGoodJobManagement[] = [];
  formCcp: FormGroup = new FormGroup({});
  // * Documents table & params
  documentsParams = new BehaviorSubject(new FilterParams());
  docs: IAttachedDocument[] = [];
  totalDocuments = 0;
  // * Goods table & params
  goodsParams = new BehaviorSubject(new FilterParams());
  goods: IGood[] = [];
  totalGoods = 0;

  goodsData: any[] = GoodsData;

  cppForm = this.fb.group(new CppForm());
  copies: any[] = [];
  disableCpp: boolean = false;
  docSettings;
  docsData: any[] = DocsData;
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  senders = new DefaultSelect();
  receivers = new DefaultSelect();
  cities = new DefaultSelect();

  usersCcp: any = [];
  gParams = {
    // P_GEST_OK
    pDestOk: '',
    //P_NO_TRAMITE
    pPaperworkNum: '',
    //TIPO_OF
    typeOf: '',
    //SALE
    sale: '',
    //DOC
    doc: '',
    // BIEN
    good: '',
    // VOLANTE
    flyer: '',
    // EXPEDIENTE
    expedient: '',
    // PLLAMO
    pllamo: '',
    // P_DICTAMEN
    pDictum: '',
  };

  get formType() {
    return this.form.controls.recordCommerType.value;
  }

  get controls() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsJobManagementService: GoodsJobManagementService,
    private mJobManagement: MJobManagementService,
    private showHide: showHideErrorInterceptorService,
    private goodService: GoodService,
    private attachedDocumentsService: AtachedDocumentsService,
    private usersService: UsersService,
    private cityService: CityService,
    private copiesJobManagement: CopiesJobManagementService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };

    this.docSettings = {
      ...this.settings,
      actions: { add: false, delete: true, edit: false },
      columns: COLUMNS2,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.onTypeFormChange();
    this.documentsParams
      .pipe(
        skip(1),
        takeUntil(this.$unSubscribe),
        switchMap(params => this.getDocuments(params))
      )
      .subscribe();
    this.goodsParams
      .pipe(
        skip(1),
        takeUntil(this.$unSubscribe),
        switchMap(params => this.getGoods(params))
      )
      .subscribe();
  }

  goodNumChange() {
    const goodId = this.controls.goodId.value;
    if (!goodId) {
      return;
    }
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('goodNumber', goodId);
    this.goodService
      .getById(goodId)
      .pipe(
        catchError(error => {
          this.onLoadToast('error', 'Error', 'El bien no existe');
          return throwError(() => error);
        }),
        switchMap(() => {
          this.showHide.showHideError(false);
          return this.goodsJobManagementService
            .getAllFiltered(params.getParams())
            .pipe(
              map(response => response.data.map(row => row.managementNumber)),
              switchMap(ids => this.getMGoods(ids, 'refersTo', 'OFCOMER'))
            );
        })
      )
      .subscribe({
        next: response =>
          this.handleDocumentsCount(response.count, response.data),
      });
  }

  handleDocumentsCount(count: number, documents: IMJobManagement[]) {
    if (count == 2) {
      this.chooseDocument(documents);
    }
  }

  async chooseDocument(documents: IMJobManagement[]) {
    const delyveryDcocument = documents.find(document =>
      document.description.includes('/ENT')
    );
    const deedDocument = documents.find(document =>
      document.description.includes('ESCRITURACION/ESC')
    );
    console.log({ deedDocument, delyveryDcocument });
    const result = await this.alertQuestion(
      'question',
      'El bien tiene dos oficios, seleccione uno',
      '',
      'Entrega',
      'Escrituracion'
    );
    // Entrega
    if (result.isConfirmed) {
      this.whenIsDelivery(delyveryDcocument);
    }

    // Escrituración
    if (!result.isConfirmed) {
      this.whenIsDeed(deedDocument);
    }
  }

  generalFunctions(document: IMJobManagement) {
    this.getCopies(document.managementNumber);
    this.form.patchValue(document);
    this.getAllData(document);
    if (document.statusOf == 'ENVIADO') {
      this.form.disable();
      this.officeTypeCtrl.disable();
      this.cppForm.disable();
      this.disableCpp = true;
    } else {
      this.form.enable();
      this.officeTypeCtrl.enable();
      this.cppForm.enable();
      this.disableCpp = false;
    }
  }

  getCopies(officeNum: string | number) {
    this.copiesJobManagement.getCopiesManagement(officeNum).subscribe({
      next: response => {
        this.copies = response.data.map(user => {
          return { id: user.nombre, name: user.nombre };
        });
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener las copias'
        );
      },
    });
  }

  whenIsDelivery(document: IMJobManagement) {
    this.generalFunctions(document);

    this.officeTypeCtrl.setValue('ENT');
    this.controls.recordCommerType.setValue('bie');
  }

  whenIsDeed(document: IMJobManagement) {
    this.generalFunctions(document);
    this.officeTypeCtrl.setValue('ESC');
    this.controls.recordCommerType.setValue('bie');
    console.log(document.problematiclegal);
    if (document.problematiclegal?.includes('jurídica 3')) {
      this.problematicRadios.setValue(1);
    }

    if (document.problematiclegal?.includes('jurídica 4')) {
      this.problematicRadios.setValue(2);
    }
    this.showJuridic = true;
  }

  getAllData(document: IMJobManagement) {
    const { managementNumber, sender, addressee, city } = document;
    const docParams = this.documentsParams.getValue();
    docParams.removeAllFilters();
    docParams.addFilter('managementNumber', managementNumber);
    this.documentsParams.next(docParams);

    const goodParams = this.goodsParams.getValue();
    goodParams.removeAllFilters();
    goodParams.addFilter('managementNumber', managementNumber);
    this.goodsParams.next(goodParams);

    const sendersParams = new FilterParams();
    sendersParams.search = sender;
    this.getSenders(sendersParams);
    const receiverParams = new FilterParams();
    receiverParams.search = addressee;
    this.getReceivers(receiverParams);

    this.getCityById(city);
  }

  getSenders(params: FilterParams) {
    this.getUsers(params).subscribe({
      next: response =>
        (this.senders = new DefaultSelect(response.data, response.count)),
      error: error =>
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener el Remitente'
        ),
    });
  }

  getCities(params: ListParams) {
    this.cityService.getAll(params).subscribe({
      next: response => {
        this.cities = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener las ciudades'
        );
      },
    });
  }

  getCityById(cityId: string | number) {
    this.cityService.getById(cityId).subscribe({
      next: city => {
        this.cities = new DefaultSelect([city], 1);
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener la ciudad'
        );
      },
    });
  }

  getReceivers(params: FilterParams) {
    this.getUsers(params).subscribe({
      next: response =>
        (this.receivers = new DefaultSelect(response.data, response.count)),
      error: error =>
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener el Destinatario'
        ),
    });
  }

  getUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams());
  }

  getDocuments(params: FilterParams) {
    return this.attachedDocumentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener los documentos'
        );
        return throwError(() => error);
      }),
      tap(response => {
        this.docs = response.data;
        this.totalDocuments = response.count;
      })
    );
  }

  getGoods(params: FilterParams) {
    return this.goodsJobManagementService
      .getAllFiltered(params.getParams())
      .pipe(
        catchError(error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener los bienes'
          );
          return throwError(() => error);
        }),
        tap(response => {
          this.goods = response.data.map(goodJob => goodJob.goodNumber);
          this.totalGoods = response.count;
        })
      );
  }

  getMGoods(ids: string[] | number[], filter: string, value: string) {
    const params = new FilterParams();
    params.addFilter('managementNumber', ids.join(','), SearchFilter.IN);
    params.addFilter(filter, value, SearchFilter.ILIKE);
    this.showHide.showHideError(false);
    return this.mJobManagement.getAllFiltered(params.getParams());
  }

  onTypeFormChange() {
    this.form.controls.recordCommerType.valueChanges
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: value => (value == 'bie' ? this.isGood() : this.isPortfolio()),
      });
  }

  isGood() {
    const { event, portfolio, lot, goodId } = this.controls;
    this.setControlNullAndOptional([event, portfolio, lot]);
    this.setControlRequired([goodId]);
  }

  isPortfolio() {
    const { event, portfolio, lot, goodId } = this.controls;
    this.setControlNullAndOptional([goodId]);
    this.setControlRequired([event, portfolio, lot]);
  }

  setControlNullAndOptional(controls: FormControl[]) {
    controls.forEach(control => {
      control.reset();
      control.removeValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  setControlRequired(controls: FormControl[]) {
    controls.forEach(control => {
      control.addValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  private prepareForm(): void {
    this.formCcp = this.fb.group({
      userId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      scannerFolio: [null],
    });

    this.formCcp.valueChanges.subscribe(value => {
      let includeId = this.usersCcp.some(
        (us: any) => us.userId == value.userId
      );
      let includeName = this.usersCcp.some((us: any) => us.name == value.name);
      if (!includeId && !includeName && this.formCcp.valid) {
        this.usersCcp.push(value);
      }
    });
  }

  openModal(context?: Partial<AddDocsComponent>): void {
    const modalRef = this.modalService.show(AddDocsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.refresh.subscribe((data: any) => {});
  }

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este documento?'
    ).then(question => {
      if (question.isConfirmed) {
      }
    });
  }

  removeItem(index: number): void {
    this.usersCcp.splice(index, 1);
  }

  resetForm(): void {
    // this.alertQuestion(
    //   'warning',
    //   'Borrar',
    //   'Desea borrar los datos ingresados?'
    // ).then(question => {
    //   if (question.isConfirmed) {
    //   }
    // });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
