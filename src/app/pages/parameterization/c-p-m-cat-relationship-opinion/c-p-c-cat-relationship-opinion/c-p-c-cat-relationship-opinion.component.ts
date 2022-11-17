import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REL_OPINION_COLUMNS } from './relationship-opinion-columns';

@Component({
  selector: 'app-c-p-c-cat-relationship-opinion',
  templateUrl: './c-p-c-cat-relationship-opinion.component.html',
  styles: [],
})
export class CPCCatRelationshipOpinionComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  selectedAffair: any = null;
  affairItems = new DefaultSelect();

  columns: any[] = [];
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...REL_OPINION_COLUMNS },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getAffair({ inicio: 1, text: '' });
    this.getPagination();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idAffair: [null, [Validators.required]],
      good: [null, [Validators.required]],
    });
  }

  getPagination() {
    this.columns = this.data2;
    this.totalItems = this.columns.length;
  }

  data: any[] = [
    {
      id: 'PUESTA A DISPOSICIÓN',
      type: 'Tipo de volante 01',
      good: true,
      user: true,
    },
    {
      id: 'DEVOLUCIÓN DE BIENES ASEGURADOS',
      type: 'Tipo de volante 02',
      good: true,
      user: true,
    },
    {
      id: 'AMPARO CONTRA EL SAE',
      type: 'Tipo de volante 03',
      good: true,
      user: true,
    },
  ];

  data2 = [
    {
      idD: 10,
      name: 'DICTAMEN 01',
      d: false,
      b: true,
      u: true,
      i: true,
      e: false,
    },
    {
      idD: 20,
      name: 'DICTAMEN 02',
      d: true,
      b: true,
      u: false,
      i: true,
      e: false,
    },
    {
      idD: 30,
      name: 'DICTAMEN 03',
      d: false,
      b: false,
      u: true,
      i: true,
      e: false,
    },
    {
      idD: 40,
      name: 'DICTAMEN 04',
      d: false,
      b: true,
      u: false,
      i: true,
      e: true,
    },
  ];

  getAffair(params: ListParams) {
    if (params.text == '') {
      this.affairItems = new DefaultSelect(this.data, 3);
    } else {
      const id = parseInt(params.text);
      const item = [this.data.filter((i: any) => i.id == id)];
      this.affairItems = new DefaultSelect(item[0], 1);
    }
  }

  selectAffair(event: any) {
    this.selectedAffair = event;
  }

  onSaveConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Actualizado', '');
  }

  onAddConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Creado', '');
  }

  onDeleteConfirm(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Eliminado', '');
  }

  // create() {
  //   this.data1.getElements().then((data: any) => {
  //     this.loading = true;
  //     this.handleSuccess();
  //   });
  // }

  // confirm() {
  //   this.edit ? this.update() : this.create();
  // }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
  }

  update() {
    this.loading = true;
    this.handleSuccess();
  }
}
