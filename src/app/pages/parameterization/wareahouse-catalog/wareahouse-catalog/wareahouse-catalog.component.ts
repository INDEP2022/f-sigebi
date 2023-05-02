import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-wareahouse-catalog',
  templateUrl: './wareahouse-catalog.component.html',
  styles: [],
})
export class WareahouseCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[] = [];
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
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      property: [null, [Validators.required]],
      warehouse: [null, [Validators.required]],
      warehouse_I: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  openForm(event: any) {}
  execute() {}
}
