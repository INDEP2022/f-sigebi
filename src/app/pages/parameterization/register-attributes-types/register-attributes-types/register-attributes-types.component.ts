import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REGISTER_ATT_TYPES_COLUMNS } from './register-attributes-types-columns';
//models
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
//Services
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { RegisterAttributesTypesModalComponent } from '../register-attributes-types-modal/register-attributes-types-modal.component';

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

  show: boolean = false;

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
  attribField: string = 'attrib';
  idField: string = 'id';

  // goodTypeChange = new EventEmitter<IGoodType>();
  // goodSubtypeChange = new EventEmitter<IGoodSubType>();
  // goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  // goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();

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
  get attrib() {
    return this.form.get(this.attribField);
  }
  get id() {
    return this.form.get(this.idField);
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
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
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
      id: [null],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
      attrib: [
        { value: null, disabled: true },
        Validators.pattern(NUMBERS_PATTERN),
      ],
    });
  }

  //Métodos para autocompletar los tipos
  getTypes(params: ListParams) {
    this.service.getAll(params).subscribe(
      res => {
        this.types = new DefaultSelect(res.data, res.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.onLoadToast('error', 'Error', error);
      }
    );
    /* this.service.search(params).subscribe(
      data => {
        this.types = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          //error = err.message;
        }

        //this.onLoadToast('error', 'Error', error);
      },
      () => {}
    ); */
  }

  getSubtypes(params: ListParams) {
    this.goodSubtypesService
      .getAll({ 'filter.idTypeGood': this.type.value, ...params })
      .subscribe(data => {
        console.log(data);
        this.subtypes = new DefaultSelect(data.data, data.count);
      });
  }

  getSsubtypes(params: ListParams) {
    this.goodSsubtypeService
      .getAll({
        'filter.noType': this.type.value,
        'filter.noSubType': this.subtype.value,
        ...params,
      })
      .subscribe(data => {
        this.ssubtypes = new DefaultSelect(data.data, data.count);
      });
  }

  getSssubtypes(params: ListParams) {
    this.goodSssubtypeService
      .getAll({
        'filter.noType': this.type.value,
        'filter.numSubType': this.subtype.value,
        'filter.numSsubType': this.ssubtype.value,
        ...params,
      })
      .subscribe(data => {
        this.sssubtypes = new DefaultSelect(data.data, data.count);
      });
  }

  onTypesChange(type: any) {
    this.resetFields([
      this.subtype,
      this.ssubtype,
      this.sssubtype,
      this.attrib,
      this.id,
    ]);
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    console.log(type);
    if (!this.type.value) {
      this.types = new DefaultSelect([type.idTypeGood], 1);
      this.type.setValue(type.idTypeGood.id);
    }
    this.form.updateValueAndValidity();
    // this.goodTypeChange.emit(type);
    this.getSubtypes(new ListParams());
  }

  onSubtypesChange(subtype: any) {
    this.resetFields([this.ssubtype, this.sssubtype, this.attrib, this.id]);
    this.sssubtypes = new DefaultSelect();
    if (!this.type.value || !this.subtype.value) {
      this.types = new DefaultSelect([subtype.idTypeGood.id], 1);
      this.subtypes = new DefaultSelect([subtype.id], 1);
      this.type.setValue(subtype.idTypeGood.id);
      this.subtype.setValue(subtype.id);
    }
    this.getSsubtypes(new ListParams());
  }

  onSsubtypesChange(ssubtype: any) {
    this.resetFields([this.sssubtype, this.attrib, this.id]);
    if (!this.type.value || !this.subtype.value) {
      console.log(ssubtype);
      this.types = new DefaultSelect([ssubtype.numType], 1);
      this.subtypes = new DefaultSelect([ssubtype.numSubType], 1);
      this.ssubtypes = new DefaultSelect([ssubtype.numSsubType], 1);
      this.type.setValue(ssubtype.numType.id);
      this.subtype.setValue(ssubtype.numSubType.id);
      this.ssubtype.setValue(ssubtype.numSsubType.id);
    }
    this.getSssubtypes(new ListParams());
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

    // this.goodSssubtypeChange.emit(sssubtype);
  }

  onValuesChange(goodSssubtypeChange: IGoodSssubtype): void {
    console.log(goodSssubtypeChange);
    this.dataAttribClassifGood.load([]);
    this.goodSssubType = goodSssubtypeChange;
    this.form.controls['attrib'].setValue(goodSssubtypeChange.numClasifGoods);
    this.form.controls['id'].setValue(goodSssubtypeChange.id);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field.setValue(null);
    });
    this.form.updateValueAndValidity();
  }

  // Métodos para llenar tabla con registros con el No. Atributo bien
  getSssubtypeById(): void {
    let _id = this.form.controls['attrib'].value;
    this.loading = true;
    if (_id !== null) {
      console.log('con datos');
      this.getAttribClassifGoodbySss(_id);
    }
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
        this.dataAttribClassifGood.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openForm(attribClassifGood?: IAttribClassifGoods) {
    let _id = this.form.controls['attrib'].value;
    console.log('Pantalla incial', _id);
    let config: ModalOptions = {
      initialState: {
        attribClassifGood,
        _id,
        callback: (next: boolean) => {
          if (next) this.getAttribClassifGood(_id);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RegisterAttributesTypesModalComponent, config);
  }

  resetForm() {
    this.form.reset();
    this.subtypes = new DefaultSelect([], 0, true);
    this.ssubtypes = new DefaultSelect([], 0, true);
    this.sssubtypes = new DefaultSelect([], 0, true);
  }
}
