import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { tap } from 'rxjs';
import { SelectFractionComponent } from 'src/app/@standalone/modals/select-fraction/select-fraction.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { ITypesByClasification } from 'src/app/core/models/catalogs/types-by-clasification';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { TypesByClasificationService } from 'src/app/core/services/catalogs/types-by-clasification.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  SSSUBTYPES_CLASIF,
  SUBTYPES_CLASIF,
  TYPES_CLASIF,
} from '../../utils/constants/filter-match';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';

@Component({
  selector: 'clasification-filter',
  templateUrl: './clasification-filter.component.html',
  styles: [],
})
export class ClasificationFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  @Input() params: FilterParams;
  @Input() subloading: boolean;
  @Output() subloadingChange = new EventEmitter<boolean>();

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
  ) {}

  changeSubloading(value: boolean) {
    this.subloading = value;
    this.subloadingChange.emit(this.subloading);
  }

  ngOnInit(): void {}

  fractionChange() {}

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
      error: () => this.changeSubloading(false),
    });
  }

  getSubtypes(params?: ListParams) {
    const _types = this.form.controls.types.value;
    const types = _types.map(type => type.id);
    this.changeSubloading(true);
    this.goodSubtypeService.getByManyIds({ types }, params).subscribe({
      next: response => {
        this.changeSubloading(false);
        this.subtypes = new DefaultSelect(response.data, response.count);
      },
      error: () => this.changeSubloading(false),
    });
  }

  getSsubtypes(params?: ListParams) {
    const _types = this.form.controls.types.value;
    const types = _types.map(type => type.id);
    const _subtypes = this.form.controls.subtypes.value;
    const subtypes = _subtypes.map(subtype => subtype.id);
    this.changeSubloading(true);
    this.goodSsubtypeService
      .getByManyIds({ types, subtypes }, params)
      .subscribe({
        next: response => {
          this.changeSubloading(false);
          this.ssubtypes = new DefaultSelect(response.data, response.count);
        },
        error: () => this.changeSubloading(false),
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
    this.goodSssubtypeService
      .getByManyIds({ types, subtypes, ssubtypes }, params)
      .subscribe({
        next: response => {
          this.changeSubloading(false);
          this.sssubtypes = new DefaultSelect(response.data, response.count);
        },
        error: () => this.changeSubloading(false),
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
}
