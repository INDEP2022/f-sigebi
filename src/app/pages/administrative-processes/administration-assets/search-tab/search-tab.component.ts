import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { SEARCH_COLUMNS } from './search-columns';

@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styles: [],
})
export class SearchTabComponent extends BasePage implements OnInit {
  searchTabForm: ModelForm<any>;
  @Output() dataSearch = new EventEmitter<{ data: any; exist: boolean }>();
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  list: any[] = [];
  classifGood: number;
  constructor(
    private fb: FormBuilder,
    private readonly goodService: GoodService,
    private readonly notifyService: NotificationService
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = SEARCH_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchTabForm.get('noBien').valueChanges.subscribe({
      next: val => {
        this.goodService.getStatusByGood(val).subscribe({
          next: data => {
            this.searchTabForm
              .get('estatus')
              .patchValue(data.status_descripcion);
            let dataParam = this.params.getValue();
            dataParam.addFilter('expedientNumber', data.expedientNumber);
            this.notifyService.getAllFilter(dataParam.getParams()).subscribe({
              next: data => {
                this.list = data.data;
                this.dataSearch.emit({
                  data: val,
                  exist: true,
                });
              },
            });
          },
        });
      },
    });
  }
  private prepareForm() {
    this.searchTabForm = this.fb.group({
      noClasifBien: [null, [Validators.required]],
      noTipo: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      noSubtipo: [null, [Validators.required]],
      subtipo: [null, [Validators.required]],
      noSsubtipo: [null, [Validators.required]],
      ssubtipo: [null, [Validators.required]],
      noSssubtipo: [null, [Validators.required]],
      sssubtipo: [null, [Validators.required]],
      estatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      unidadMedida: [null, [Validators.required]],
      cantidad: [null, [Validators.required]],
      noDestino: [null, [Validators.required]],
      situacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      destino: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noBien: [null, [Validators.required]],
      goodDescription: [null],
      valRef: [null, [Validators.required]],
      identifica: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descripcion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  getGoods(ssssubType: IGoodSssubtype) {
    this.classifGood = ssssubType.numClasifGoods;
  }
}
