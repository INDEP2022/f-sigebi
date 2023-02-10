import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SelectFractionComponent } from 'src/app/@standalone/modals/select-fraction/select-fraction.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
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

  ngOnInit(): void {}

  fractionChange() {}

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getTypes(params: ListParams) {
    this.goodTypesService.getAll(params).subscribe(response => {
      this.types = new DefaultSelect(response.data, response.count);
    });
  }

  getSubtypes(params?: ListParams) {
    const types = this.form.controls.types.value;
    this.goodSubtypeService.getByManyIds({ types }, params).subscribe({
      next: response =>
        (this.subtypes = new DefaultSelect(response.data, response.count)),
    });
  }

  getSsubtypes(params?: ListParams) {
    const types = this.form.controls.types.value;
    const subtypes = this.form.controls.subtypes.value;
    this.goodSsubtypeService
      .getByManyIds({ types, subtypes }, params)
      .subscribe({
        next: response =>
          (this.ssubtypes = new DefaultSelect(response.data, response.count)),
      });
  }

  getSssubtypes(params?: ListParams) {
    const types = this.form.controls.types.value;
    const subtypes = this.form.controls.subtypes.value;
    const ssubtypes = this.form.controls.ssubtypes.value;
    this.goodSssubtypeService
      .getByManyIds({ types, subtypes, ssubtypes }, params)
      .subscribe({
        next: response =>
          (this.sssubtypes = new DefaultSelect(response.data, response.count)),
      });
  }

  getClasif() {
    const params = new ListParams();
    params.limit = 1000;
    const types = this.form.controls.types.value;
    const subtypes = this.form.controls.subtypes.value;
    const ssubtypes = this.form.controls.ssubtypes.value;
    return this.goodSssubtypeService.getByManyIds(
      { types, subtypes, ssubtypes },
      params
    );
  }

  typesChange() {
    TYPES_CLASIF.length = 0;
    this.getClasif().subscribe({
      next: res => TYPES_CLASIF.push(res.data.map(t => t.numClasifGoods)),
    });
    this.getSubtypes();
  }

  subtypesChange() {
    SUBTYPES_CLASIF.length = 0;
    this.getClasif().subscribe({
      next: res => SUBTYPES_CLASIF.push(res.data.map(t => t.numClasifGoods)),
    });
    this.getSsubtypes();
  }

  ssubtypesChange() {
    SSSUBTYPES_CLASIF.length = 0;
    this.getClasif().subscribe({
      next: res => SSSUBTYPES_CLASIF.push(res.data.map(t => t.numClasifGoods)),
    });
    this.getSssubtypes();
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
    this.typesByClasificationService.getById(clasifNum).subscribe({
      next: res => this.fillTypesByClasif(res),
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
