/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDelegation } from 'src/app/core/models/ms-survillance/survillance';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProtectionService } from 'src/app/core/services/ms-protection/protection.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

type SuspensionType = 'PROVISIONAL' | 'DEFINITIVA' | 'DE PLANO' | '';
@Component({
  selector: 'app-assignation-goods-protection',
  templateUrl: './assignation-goods-protection.component.html',
  styleUrls: ['./assignation-goods-protection.component.scss'],
})
export class AssignationGoodsProtectionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    selectedRowIndex: -1,
    columns: {
      goodId: {
        title: 'No. Bien',
        sort: false,
        type: 'html',
        valuePrepareFunction: (ev: any) => {
          return `<div class="bg-success text-white text-center">${ev}</div>`;
        },
      },
      description: {
        title: '',
        sort: false,
        type: 'html',
        valuePrepareFunction: (ev: any) => {
          return `<div class="bg-success text-white text-center">${ev}</div>`;
        },
      },
    },
  };
  // Data table 1
  dataTable: IGood[] = [];
  private data: IGood[] = [];
  private data2: IGood[] = [];
  tableSettings2 = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    selectedRowIndex: -1,
    columns: {
      goodId: {
        title: 'No. Bien',
        sort: false,
      }, //*
    },
  };
  // Data table 2
  dataTable2: IGood[] = [];
  items = new DefaultSelect<Example>();
  minItems = new DefaultSelect<IMinpub>();
  courtItems = new DefaultSelect<ICourt>();
  delegationItems = new DefaultSelect<IDelegation>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems = 0;
  goodAdd: IGood;
  goodRemove: IGood;
  public form: FormGroup;
  public formAmparo: FormGroup;

  paramsDel = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsMin = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsCourt = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsExp = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private fb: FormBuilder,
    private exampleService: ExampleService,
    private goodService: GoodService,
    private protectionService: ProtectionService,
    private router: Router,
    private delegationServ: DelegationService,
    private minService: MinPubService,
    private courtServ: CourtService,
    private route: ActivatedRoute,
    private expedientService: ExpedientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: param => {
        const id = param.get('id');
        if (id) {
          setTimeout(() => {
            const params = new ListParams();
            params.text = id;
            this.getExpedient(params);
          }, 1000);
        }
      },
    });

    this.paramsDel
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDelegation(new ListParams()));
    this.paramsMin
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMin(new ListParams()));
    this.paramsCourt
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCourt(new ListParams()));

    this.loading = true;
    this.prepareForm();
  }

  getExpedient(params: ListParams) {
    this.paramsExp.getValue().removeAllFilters();
    this.paramsExp.getValue().page = params.page;
    if (params.text)
      this.paramsExp.getValue().addFilter('id', params.text, SearchFilter.EQ);

    this.expedientService
      .getAllFilter(this.paramsExp.getValue().getParams())
      .subscribe({
        next: resp => {
          this.expedientSelect(resp.data[0]);
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.error.message;
          }
          this.onLoadToast('error', error, '');
        },
      });
  }

  getDelegation(params?: ListParams) {
    this.paramsDel.getValue().removeAllFilters();
    this.paramsDel.getValue().sortBy = 'description:ASC';
    this.paramsDel.getValue().page = params.page;
    this.paramsDel
      .getValue()
      .addFilter('description', params.text ?? '', SearchFilter.ILIKE);
    this.delegationServ
      .getAllFiltered(this.paramsDel.getValue().getParams())
      .subscribe({
        next: resp => {
          this.delegationItems = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {
          this.delegationItems = new DefaultSelect();
        },
      });
  }

  getCourt(params?: ListParams) {
    this.paramsCourt.getValue().removeAllFilters();
    this.paramsCourt.getValue().page = params.page;
    this.paramsCourt.getValue().sortBy = 'description:ASC';
    this.paramsCourt
      .getValue()
      .addFilter('description', params.text ?? '', SearchFilter.ILIKE);
    this.courtServ
      .getAllFiltered(this.paramsCourt.getValue().getParams())
      .subscribe({
        next: resp => {
          this.courtItems = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {
          this.courtItems = new DefaultSelect();
        },
      });
  }

  getMin(params?: ListParams) {
    this.paramsMin.getValue().removeAllFilters();
    this.paramsMin.getValue().page = params.page;
    this.paramsMin.getValue().sortBy = 'description:ASC';
    this.paramsMin
      .getValue()
      .addFilter('description', params.text ?? '', SearchFilter.ILIKE);
    this.minService
      .getAllWithFilters(this.paramsMin.getValue().getParams())
      .subscribe({
        next: resp => {
          this.minItems = new DefaultSelect(resp.data, resp.count);
        },
        error: error => {
          this.minItems = new DefaultSelect();
        },
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]], //* id
      preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]], // Preliminary Inquiry
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]], // Criminal Case
      protectionKey: [null],
    });
    this.formAmparo = this.fb.group({
      suspensionType: '', // Provisional, Definitiva, De plano
      reportPreviousDate: [new Date()],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      amparo: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      protectionType: [null, [Validators.required]], //* Directo, Indirecto
      officialDate: [new Date()],
      reportJustifiedDate: [null],
      minpubNumber: [null], // Detalle Min. Pub.
      courtNumber: [null], // Detalle No Juzgado
      responsable: [null, Validators.pattern(STRING_PATTERN)],
      delegationNumber: [null], // 4 campos con el primero en id
      complainers: [null, [Validators.pattern(STRING_PATTERN)]],
      actReclaimed: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  expedientSelect(expedient: IExpedient) {
    this.minItems = new DefaultSelect<IMinpub>([], 0, true);
    this.courtItems = new DefaultSelect<ICourt>([], 0, true);
    this.delegationItems = new DefaultSelect<IDelegation>([], 0, true);
    this.formAmparo.reset();
    this.form.patchValue(expedient);
    if (expedient) {
      this.getData(this.form.value);
    }
    this.dataTable = [];
    this.dataTable2 = [];
    this.data = [];
    this.data2 = [];
  }

  private getData(val: any) {
    let params = new ListParams();
    params.limit = 5;
    params.page = 1;
    params.text = '';
    if (val.id) {
      this.goodService.getByExpedient(val.id, params).subscribe({
        next: value => {
          console.log('Bienes', value);

          this.dataTable = [...value.data];
          this.data = [...this.dataTable];
        },
      });
    }
    let filterParams = new FilterParams();
    filterParams.limit = 10;
    filterParams.page = 1;
    filterParams.addFilter('proceedingsNumber', val.id, SearchFilter.EQ);
    if (val.id) {
      this.protectionService
        .getAllWithFilters(filterParams.getParams())
        .subscribe({
          next: value => {
            let amparo: any = value.data[0];
            this.formAmparo.patchValue(amparo);
            if (amparo.minpubNumber) {
              const paramsD = new ListParams();
              paramsD.text = amparo.minpubNumber.description;
              this.getMin(paramsD);
              this.formAmparo
                .get('minpubNumber')
                .patchValue(amparo.minpubNumber.minpubNumber);
            }
            if (amparo.delegationNumber) {
              const paramsD = new ListParams();
              paramsD.text = amparo.delegationNumber.description;
              this.getDelegation(paramsD);
              this.formAmparo
                .get('delegationNumber')
                .patchValue(amparo.delegationNumber.delegationId);
            }
            if (amparo.courtNumber) {
              const paramsD = new ListParams();
              paramsD.text = amparo.courtNumber.description;
              this.getCourt(paramsD);
              // this.courtItems = new DefaultSelect([amparo.courtNumber]);
              this.formAmparo
                .get('courtNumber')
                .patchValue(amparo.courtNumber.courtNumber);
            }
            // this.formTipoSuspersion.patchValue(amparo);
            this.formAmparo
              .get('suspensionType')
              .patchValue(this.setSuspensionType(amparo));
          },
        });
    }
  }

  private setSuspensionType(amparo: any): SuspensionType {
    if (amparo.suspensionfinal == 'N') {
      return 'DEFINITIVA';
    } else if (amparo.suspensionOfFlat == 'P') {
      return 'DE PLANO';
    } else if (amparo.suspensionProvisional == 'N') {
      return 'PROVISIONAL';
    } else {
      return '';
    }
  }

  mostrarInfo(): any {
    const { id } = this.form.value;
    if (id) {
      this.router.navigate(
        [`/pages/juridical/depositary/notifications-file/${id}`],
        { queryParams: { origin: 'FACTJURBIENESXAMP' } }
      );
    } else {
      this.onLoadToast(
        'info',
        'No se tiene expediente, favor de verificar.',
        ''
      );
    }
  }

  selectGoodTable1({ data, isSelected }: any) {
    if (isSelected) {
      this.goodAdd = data;
    }
  }
  selectGoodTable2({ data, isSelected }: any) {
    console.log(isSelected);

    if (isSelected) {
      this.goodRemove = data;
    }
  }

  btnAgregar() {
    if (this.goodAdd) {
      this.data2.push(this.goodAdd);
      this.data.splice(
        this.data.findIndex(item => item.id === this.goodAdd.id),
        1
      );
      this.dataTable = [...this.data];
      this.dataTable2 = [...this.data2];
      console.log('Agregar');
      this.goodAdd = null;
    }
  }

  btnEliminar() {
    if (this.goodRemove) {
      this.data.push(this.goodRemove);
      this.data2.splice(
        this.data2.findIndex(item => item.id === this.goodRemove.id),
        1
      );
      this.dataTable = [...this.data];
      this.dataTable2 = [...this.data2];
      console.log('Eliminar');
      this.goodRemove = null;
    }
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
