import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { AUTO_COLUMNS } from '../../../consultation/consultation-real-state/consultation-real-state/consultation-real-state-columns';

@Component({
  selector: 'app-automobiles',
  templateUrl: './automobiles.component.html',
  styles: [],
})
export class automobilesComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  array: any = [];
  show: boolean = false;
  show2: boolean = false;
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  totalItems: number = 0;
  settings2 = {
    ...this.settings,
    actions: false,
  };

  constructor(
    private fb: FormBuilder,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...AUTO_COLUMNS,
        seleccion: {
          title: 'Selección',
          type: 'custom',
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onSelectDelegation(instance),
          sort: false,
          filter: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  onSelectDelegation(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => {
        //this.selectDelegation(data.row, data.toggle),
        console.log(data.toggle, data.row.numClasifGoods);
        if (data.toggle == true) {
        }

        const existe = this.array.some(
          (objeto: any) => objeto.id === data.row.numClasifGoods
        );
        console.log(existe);
        if (existe) {
          const index = this.array.findIndex(
            (objeto: any) => objeto.id === data.row.id
          );
          console.log(index);
          this.array.splice(index, 1);
        } else {
          this.array.push(data.row.numClasifGoods);
        }
        console.log(this.array);
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      NoBien: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      DescBien: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  chargeFile(event: any) {}

  getDataAll() {
    if (!this.form.get('NoBien').value) {
      this.alert(
        'warning',
        'Es Necesario contar con el No. Clasificación del Bien',
        ''
      );
      return;
    }
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    param['filter.numClasifGoods'] = `$eq:${this.form.get('NoBien').value}`;
    this.goodSssubtypeService.getAll(param).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
        this.show = true;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.alert('warning', 'No se Encontraron Registros', '');
      },
    });
  }

  getDataByDesc() {
    if (!this.form.get('DescBien').value) {
      this.alert(
        'warning',
        'Es Necesario contar con la Descripción del Bien',
        ''
      );
      return;
    }
    let param = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    param['filter.description'] = `$ilike:${this.form.get('DescBien').value}`;
    this.goodSssubtypeService.getAll(param).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
        this.show = true;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.alert('warning', 'No se Encontraron Registros', '');
      },
    });
  }
  rowsSelected(event: any) {
    //console.log(event.isSelected);
  }

  cleanBy() {
    this.form.get('NoBien').setValue('');
    this.data.load([]);
    this.show = false;
  }

  cleanByDesc() {
    this.form.get('DescBien').setValue('');
    this.data.load([]);
    this.show = false;
    this.form.reset;
  }
}
