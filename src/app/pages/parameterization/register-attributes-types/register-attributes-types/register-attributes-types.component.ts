import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REGISTER_ATT_TYPES_COLUMNS } from './register-attributes-types-columns';
//models
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { IGoodsSubtype } from 'src/app/core/models/catalogs/goods-subtype.model';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/goods-query-model';
//Services
import { LocalDataSource } from 'ng2-smart-table';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-register-attributes-types',
  templateUrl: './register-attributes-types.component.html',
  styles: [],
})
export class RegisterAttributesTypesComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  dataAttribClassifGood: LocalDataSource = new LocalDataSource();

  goodSssubType: IGoodSssubtype;

  //tipos
  types = new DefaultSelect<Partial<IGoodType>>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

  typeField: string = 'type';
  subtypeField: string = 'subtype';
  ssubtypeField: string = 'ssubtype';
  sssubtypeField: string = 'sssubtype';

  goodTypeChange = new EventEmitter<IGoodType>();
  goodSubtypeChange = new EventEmitter<IGoodSubType>();
  goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();

  get type() {
    return this.form.get(this.typeField);
  }
  get subtype() {
    return this.form.get(this.subtypeField);
  }
  get ssubtype() {
    return this.form.get(this.ssubtypeField);
  }
  get sssubtype() {
    return this.form.get(this.sssubtypeField);
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private service: GoodTypeService,
    private goodSubtypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private goodsQueryService: GoodsQueryService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...REGISTER_ATT_TYPES_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
      attrib: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
  }

  getTypes(params: ListParams) {
    this.service.search(params).subscribe(
      data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  getSubtypes(params: ListParams) {
    this.goodSubtypesService
      .getAll({ type: this.type.value, ...params })
      .subscribe(data => {
        this.subtypes = new DefaultSelect(data.data, data.count);
      });
  }

  getSsubtypes(params: ListParams) {
    this.goodSsubtypeService
      .getAll({
        type: this.type.value,
        subtype: this.subtype.value,
        ...params,
      })
      .subscribe(data => {
        this.ssubtypes = new DefaultSelect(data.data, data.count);
      });
  }

  getSssubtypes(params: ListParams) {
    this.goodSssubtypeService
      .getAll({
        type: this.type.value,
        subtype: this.subtype.value,
        ssubtype: this.ssubtype.value,
        ...params,
      })
      .subscribe(data => {
        this.sssubtypes = new DefaultSelect(data.data, data.count);
      });
  }

  onTypesChange(type: any) {
    this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    this.subtypes = new DefaultSelect();
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.form.updateValueAndValidity();
    this.goodTypeChange.emit(type);
  }

  onSubtypesChange(subtype: any) {
    if (!this.type.value) {
      this.types = new DefaultSelect([subtype.idTypeGood], 1);
      this.type.setValue(subtype.idTypeGood.id);
    }
    this.resetFields([this.ssubtype, this.sssubtype]);
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.goodSubtypeChange.emit(subtype);
  }

  onSsubtypesChange(ssubtype: any) {
    if (!this.type.value || !this.subtype.value) {
      this.types = new DefaultSelect([ssubtype.noType], 1);
      this.subtypes = new DefaultSelect([ssubtype.noSubType], 1);
      this.type.setValue(ssubtype.noType.id);
      this.subtype.setValue(ssubtype.noSubType.id);
    }
    this.resetFields([this.sssubtype]);
    this.goodSsubtypeChange.emit(ssubtype);
  }

  onSssubtypesChange(sssubtype: any) {
    if (!this.type.value || !this.subtype.value || !this.ssubtype.value) {
      console.log(sssubtype);
      this.types = new DefaultSelect([sssubtype.numType], 1);
      this.subtypes = new DefaultSelect([sssubtype.numSubType], 1);
      this.ssubtypes = new DefaultSelect([sssubtype.numSsubType], 1);
      this.type.setValue(sssubtype.numType.id);
      this.subtype.setValue(sssubtype.numSubType.id);
      this.ssubtype.setValue(sssubtype.numSsubType.id);
    }

    this.goodSssubtypeChange.emit(sssubtype);
  }

  onValuesChange(goodSssubtypeChange: IGoodSssubtype): void {
    console.log(goodSssubtypeChange);
    this.goodSssubType = goodSssubtypeChange;
    this.form.controls['attrib'].setValue(goodSssubtypeChange.numClasifGoods);
    this.sssubtypes = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field.setValue(null);
    });
    this.form.updateValueAndValidity();
  }

  //
  getIdSssubType(): void {
    let _id = this.form.controls['attrib'].value;
    this.loading = true;
    this.goodSssubtypeService.getByIds(_id).subscribe(
      response => {
        console.log(response);
        if (response !== null) {
          this.form.patchValue(response);
          this.form.updateValueAndValidity();
          this.getAttribClassifGoodbySss(response.id);
        } else {
          this.alert('info', 'No se encontraron algunos registros', '');
        }
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  getAttribClassifGoodbySss(id: string | number): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAttribClassifGood(id));
  }

  getAttribClassifGood(id: string | number): void {
    this.goodsQueryService.getBySssubType(id, this.params.getValue()).subscribe(
      response => {
        //console.log(response);
        let data = response.data.map((item: IAttribClassifGoods) => {
          //console.log(item);
          return item;
        });
        this.dataAttribClassifGood.load(data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }
}
