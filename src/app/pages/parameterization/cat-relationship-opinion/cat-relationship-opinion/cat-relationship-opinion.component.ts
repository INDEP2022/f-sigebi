import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { AFFAIR_COLUMNS } from './relationship-opinion-columns';
//models
import { IAffair } from 'src/app/core/models/catalogs/affair.model';
//Services
import { AffairService } from 'src/app/core/services/catalogs/affair.service';

@Component({
  selector: 'app-cat-relationship-opinion',
  templateUrl: './cat-relationship-opinion.component.html',
  styles: [],
})
export class CatRelationshipOpinionComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  // selectedAffair: any = null;
  // affairItems = new DefaultSelect();

  affair: IAffair[] = [];
  // @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private affairService: AffairService) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...AFFAIR_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAffair());
  }

  getAffair() {
    this.loading = true;
    this.affairService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.affair = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  // ngOnInit(): void {
  //   this.prepareForm();
  //   this.getAffair({ page: 1, text: '' });
  //   this.getPagination();
  // }

  // private prepareForm() {
  //   this.form = this.fb.group({
  //     idAffair: [null, [Validators.required]],
  //     good: [null, [Validators.required]],
  //   });
  // }

  // getPagination() {
  //   this.columns = this.data2;
  //   this.totalItems = this.columns.length;
  // }

  // data: any[] = [
  //   {
  //     id: 'PUESTA A DISPOSICIÓN',
  //     type: 'Tipo de volante 01',
  //     good: true,
  //     user: true,
  //   },
  //   {
  //     id: 'DEVOLUCIÓN DE BIENES ASEGURADOS',
  //     type: 'Tipo de volante 02',
  //     good: true,
  //     user: true,
  //   },
  //   {
  //     id: 'AMPARO CONTRA EL SAE',
  //     type: 'Tipo de volante 03',
  //     good: true,
  //     user: true,
  //   },
  // ];

  // data2 = [
  //   {
  //     idD: 10,
  //     name: 'DICTAMEN 01',
  //     d: false,
  //     b: true,
  //     u: true,
  //     i: true,
  //     e: false,
  //   },
  //   {
  //     idD: 20,
  //     name: 'DICTAMEN 02',
  //     d: true,
  //     b: true,
  //     u: false,
  //     i: true,
  //     e: false,
  //   },
  //   {
  //     idD: 30,
  //     name: 'DICTAMEN 03',
  //     d: false,
  //     b: false,
  //     u: true,
  //     i: true,
  //     e: false,
  //   },
  //   {
  //     idD: 40,
  //     name: 'DICTAMEN 04',
  //     d: false,
  //     b: true,
  //     u: false,
  //     i: true,
  //     e: true,
  //   },
  // ];

  // getAffair(params: ListParams) {
  //   if (params.text == '') {
  //     this.affairItems = new DefaultSelect(this.data, 3);
  //   } else {
  //     const id = parseInt(params.text);
  //     const item = [this.data.filter((i: any) => i.id == id)];
  //     this.affairItems = new DefaultSelect(item[0], 1);
  //   }
  // }

  // selectAffair(event: any) {
  //   this.selectedAffair = event;
  // }

  // onSaveConfirm(event: any) {
  //   event.confirm.resolve();
  //   this.onLoadToast('success', 'Elemento Actualizado', '');
  // }

  // onAddConfirm(event: any) {
  //   event.confirm.resolve();
  //   this.onLoadToast('success', 'Elemento Creado', '');
  // }

  // onDeleteConfirm(event: any) {
  //   event.confirm.resolve();
  //   this.onLoadToast('success', 'Elemento Eliminado', '');
  // }

  // create() {
  //   this.data1.getElements().then((data: any) => {
  //     this.loading = true;
  //     this.handleSuccess();
  //   });
  // }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  // handleSuccess() {
  //   this.loading = false;
  //   this.refresh.emit(true);
  // }

  // update() {
  //   this.loading = true;
  //   this.handleSuccess();
  // }
}
