import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
import { SelectFractionComponent } from 'src/app/@standalone/modals/select-fraction/select-fraction.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { ITypesByClasification } from 'src/app/core/models/catalogs/types-by-clasification';
import { IAlternativeClasification } from 'src/app/core/models/ms-good/alternative-clasification.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TypesByClasificationService } from 'src/app/core/services/catalogs/types-by-clasification.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SSSUBTYPES_CLASIF,
  SUBTYPES_CLASIF,
  TYPES_CLASIF,
} from '../../utils/constants/filter-match';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';
import { AlternClasficationListComponent } from '../altern-clasfication-list/altern-clasfication-list.component';

@Component({
  selector: 'clasification-filter',
  templateUrl: './clasification-filter.component.html',
  styles: [
    `
      .custom-tmp {
        font-size: 0.9em !important;
        margin-bottom: 5px !important;
        color: #333 !important;
        background-color: #ebf5ff !important;
        border-radius: 2px !important;
        margin-right: 5px !important;
      }

      .custom-icon {
        font-size: 0.9em !important;
        cursor: pointer;
        border-right: 1px solid #b8dbff !important;
        display: inline-block;
        padding: 1px 5px;
      }

      .custom-value-label {
        display: inline-block !important;
        padding: 1px 5px !important;
      }
    `,
  ],
})
export class ClasificationFilterComponent extends BasePage implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  @Input() params: FilterParams;
  @Input() subloading: boolean;
  @Output() subloadingChange = new EventEmitter<boolean>();
  @Output() cleanFilters = new EventEmitter<void>();
  alternClasifications: IAlternativeClasification[] = [];
  types = new DefaultSelect();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

  get formControls() {
    return this.form.controls;
  }
  constructor(
    private goodTypesService: GoodTypeService,
    private goodSubtypeService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private modalService: BsModalService,
    private typesByClasificationService: TypesByClasificationService
  ) {
    super();
  }

  changeSubloading(value: boolean) {
    this.subloading = value;
    this.subloadingChange.emit(this.subloading);
  }

  ngOnInit(): void {}

  fractionChange() {}

  searchClasif() {
    const { sssubtypes, ssubtypes, subtypes, types, alternativeClasifNum } =
      this.form.controls;
    if (!this.form.controls.clasifNum.value) {
      this.alert('error', 'Error', 'Ingrese un número de clasificación');
      return;
    }
    this.alternClasifications = [];
    alternativeClasifNum.reset();
    sssubtypes.setValue([]);
    ssubtypes.setValue([]);
    subtypes.setValue([]);
    types.setValue([]);
    const clasif = this.form.controls.clasifNum.value;
    const params = new FilterParams();
    params.addFilter('numClasifGoods', clasif);
    this.getSssubtypesByClasif(params.getParams()).subscribe(response => {
      this.getTypesByClasif(response.data[0].numClasifGoods);
    });
  }

  getSssubtypesByClasif(params: string) {
    return this.goodSssubtypeService.getAll2(params).pipe(
      catchError(error => {
        this.alert('error', 'Error', 'No se encontró el clasificador');
        this.ssubtypes = new DefaultSelect([], 0);
        return throwError(() => error);
      })
    );
  }

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getTypes(params: ListParams) {
    this.changeSubloading(true);
    this.goodTypesService.getAll(params).subscribe({
      next: response => {
        this.changeSubloading(false);
        this.types = new DefaultSelect(response.data, response.count);
      },
      error: () => {
        this.changeSubloading(false);
        this.types = new DefaultSelect([], 0);
      },
    });
  }

  getSubtypes(params?: ListParams) {
    const _types = this.form.controls.types.value;
    const types = _types.map(type => type.id);
    this.changeSubloading(true);
    const _params = new FilterParams();
    _params.page = params?.page ?? 1;
    _params.limit = params?.limit ?? 10;
    _params.search = params?.text ?? '';
    _params.addFilter('idTypeGood', types.join(','), SearchFilter.IN);
    this.goodSubtypeService.getAllFilter(_params.getParams()).subscribe({
      next: response => {
        console.log(response);
        this.changeSubloading(false);
        this.subtypes = new DefaultSelect(response.data, response.count);
      },
      error: () => {
        this.subtypes = new DefaultSelect([], 0);
        this.changeSubloading(false);
      },
    });
  }

  getSsubtypes(params?: ListParams) {
    const _types = this.form.controls.types.value;
    const types = _types.map(type => type.id);
    const _subtypes = this.form.controls.subtypes.value;
    const subtypes = _subtypes.map(subtype => subtype.id);
    this.changeSubloading(true);
    const _params = new FilterParams();
    _params.page = params?.page ?? 1;
    _params.limit = params?.limit ?? 10;
    _params.addFilter('noSubType', subtypes.join(','), SearchFilter.IN);
    _params.addFilter('noType', types.join(','), SearchFilter.IN);
    _params.search = params?.text ?? '';
    this.goodSsubtypeService.getAllFilter(_params.getParams()).subscribe({
      next: response => {
        this.changeSubloading(false);
        this.ssubtypes = new DefaultSelect(response.data, response.count);
      },
      error: () => {
        this.ssubtypes = new DefaultSelect([], 0);
        this.changeSubloading(false);
      },
    });
  }

  getSssubtypes(params?: ListParams) {
    const _types = this.form.controls.types.value;
    const types = _types.map(type => type.id);
    const _subtypes = this.form.controls.subtypes.value;
    const subtypes = _subtypes.map(subtype => subtype.id);
    const _ssubtypes = this.form.controls.ssubtypes.value;
    const ssubtypes = _ssubtypes.map(ssubtype => ssubtype.id);
    this.changeSubloading(true);
    const _params = new FilterParams();
    _params.page = params?.page ?? 1;
    _params.limit = params?.limit ?? 10;
    if (params?.text) {
      _params.addFilter('description', params.text, SearchFilter.ILIKE);
    }
    _params.addFilter('numType', types.join(','), SearchFilter.IN);
    _params.addFilter('numSubType', subtypes.join(','), SearchFilter.IN);
    _params.addFilter('numSsubType', ssubtypes.join(','), SearchFilter.IN);
    this.goodSssubtypeService.getFilter(_params.getParams()).subscribe({
      next: response => {
        this.changeSubloading(false);
        this.sssubtypes = new DefaultSelect(response.data, response.count);
      },
      error: () => {
        this.sssubtypes = new DefaultSelect([], 0);
        this.changeSubloading(false);
      },
    });
  }

  getClasif() {
    const params = new ListParams();
    params.limit = 1000;
    const _types = this.form.controls.types.value;
    const types = _types.map(type => type.id);
    const _subtypes = this.form.controls.subtypes.value;
    const subtypes = _subtypes.map(subtype => subtype.id);
    const _ssubtypes = this.form.controls.ssubtypes.value;
    const ssubtypes = _ssubtypes.map(ssubtype => ssubtype.id);
    console.log({ types, subtypes, ssubtypes });
    return this.goodSssubtypeService
      .getByManyIds({ types, subtypes, ssubtypes }, params)
      .pipe(tap(() => (TYPES_CLASIF.length = 0)));
  }

  typesChange(types: IGoodType[]) {
    TYPES_CLASIF.length = 0;
    if (types.length == 0) {
      return;
    }
    this.changeSubloading(true);
    this.getClasif().subscribe({
      next: res => {
        this.changeSubloading(false);
        TYPES_CLASIF.push(res.data.map(t => t.numClasifGoods));
      },
      error: () => this.changeSubloading(false),
    });
    this.getSubtypes();
  }

  subtypesChange(subtypes: IGoodSubType[]) {
    SUBTYPES_CLASIF.length = 0;
    if (subtypes.length == 0) {
      return;
    }
    this.changeSubloading(true);
    this.getClasif().subscribe({
      next: res => {
        this.changeSubloading(false);
        SUBTYPES_CLASIF.push(res.data.map(t => t.numClasifGoods));
      },
      error: () => this.changeSubloading(false),
    });
    this.getSsubtypes();
  }

  ssubtypesChange(ssubtypes: IGoodSsubType[]) {
    SSSUBTYPES_CLASIF.length = 0;
    if (ssubtypes.length == 0) {
      return;
    }
    this.changeSubloading(true);
    this.getClasif().subscribe({
      next: res => {
        this.changeSubloading(false);
        SSSUBTYPES_CLASIF.push(res.data.map(t => t.numClasifGoods));
      },
      error: () => this.changeSubloading(false),
    });
    this.getSssubtypes();
  }

  sssubtypesChange(sssubtypes: IGoodSssubtype[]) {}

  openAlternClasification() {
    const modalConfig: any = {
      ...MODAL_CONFIG,
      initialState: {
        selectedClasifications: this.alternClasifications,
        callback: (alternClasifications: IAlternativeClasification[]) => {
          const { sssubtypes, ssubtypes, subtypes, types, clasifNum } =
            this.form.controls;
          if (!alternClasifications.length) {
            this.alternClasifications = [];
            sssubtypes.setValue([]);
          }
          clasifNum.reset();
          sssubtypes.setValue([]);
          ssubtypes.setValue([]);
          subtypes.setValue([]);
          types.setValue([]);
          this.alternClasifications = alternClasifications;
          this.alternClasifChange();
        },
      },
    };
    this.modalService.show(AlternClasficationListComponent, modalConfig);
  }

  alternClasifChange() {
    const alternClasif = this.alternClasifications
      .map(clas => clas.id)
      .join(',');
    this.form.controls.alternativeClasifNum.setValue(alternClasif);
    const params = new FilterParams();
    params.addFilter('numClasifAlterna', alternClasif, SearchFilter.IN);
    params.limit = 100;
    this.getSssubtypesByClasif(params.getParams()).subscribe(response => {
      this.form.controls.alternativeClasifNum.setValue(alternClasif);
      this.form.controls.sssubtypes.setValue(
        response.data.map(sss => sss.numClasifGoods + '')
      );
      console.log(this.form.controls.sssubtypes.value);
      console.log(response.data);
      this.sssubtypes = new DefaultSelect(
        response.data.map(sss => {
          return { ...sss, numClasifGoods: sss.numClasifGoods + '' };
        }),
        response.count
      );
    });
  }

  selectFraction() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered modal-lg',
    };
    modalConfig.initialState = {
      callback: (fraction: any) => {
        this.formControls.satDepartureNum.setValue(fraction.fraction);
        this.getTypesByClasif(fraction.clasifGoodNumber);
      },
    };
    this.modalService.show(SelectFractionComponent, modalConfig);
  }

  getTypesByClasif(clasifNum: number | string) {
    this.changeSubloading(true);
    this.typesByClasificationService.getById(clasifNum).subscribe({
      next: res => {
        this.changeSubloading(false);
        this.fillTypesByClasif(res);
      },
      error: () => this.changeSubloading(false),
    });
  }

  fillTypesByClasif(types: ITypesByClasification) {
    const { sssubtype } = types;
    const sssubtypes = [
      { numClasifGoods: types.id, description: sssubtype.description },
    ];
    this.sssubtypes = new DefaultSelect(sssubtypes, 1);
    this.formControls.sssubtypes.setValue([`${types.id}`]);
  }

  cleanFilter() {
    this.alternClasifications = [];
    this.cleanFilters.emit();
  }
}
