import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { LabelOkeyService } from 'src/app/core/services/catalogs/label-okey.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  GoodTrackerForm,
  GOOD_PHOTOS_OPTIOS,
  PROCESSES,
  TARGET_IDENTIFIERS,
} from '../../utils/goods-tracker-form';

const ALLOWED_EXTENSIONS = ['txt'];

@Component({
  selector: 'data-filter',
  templateUrl: './data-filter.component.html',
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
export class DataFilterComponent extends BasePage implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  photosOptions = GOOD_PHOTOS_OPTIOS;
  targetIdentifiers = TARGET_IDENTIFIERS;
  @Input() form: FormGroup<GoodTrackerForm>;
  @Input() params: FilterParams;
  @Input() subloading: boolean;
  @Output() subloadingChange = new EventEmitter<boolean>();
  labels = new DefaultSelect();
  @Output() cleanFilters = new EventEmitter<void>();
  goodStatuses = new DefaultSelect();
  processes = PROCESSES;

  @ViewChild('goodNumbersInput', { static: true })
  goodNumbersInput: ElementRef<HTMLInputElement>;
  goodNumbersControl = new FormControl(null);
  constructor(
    private fb: FormBuilder,
    private goodLabelService: LabelOkeyService,
    private statusGoodService: StatusGoodService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }

  goodNumbersFileChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.goodNumbersControl.reset();
      return;
    }
    const file = this.getFileFromEvent(event);
    const fileReader = new FileReader();
    fileReader.onload = e => {
      this.readTxt(e.target.result);
    };
    this.goodNumbersControl.reset();
    fileReader.readAsText(file);
  }

  readTxt(txt: string | ArrayBuffer) {
    if (typeof txt != 'string') {
      this.alert('error', 'Error', 'Archivo Inválido');
      return;
    }
    const goodNumbersArrPlain = txt.split(',');

    const goodNumbers = goodNumbersArrPlain
      .map(goodNum => Number(goodNum.trim()))
      .filter(goodNum => goodNum > 0)
      .map(goodNum => `${goodNum}`);
    if (!goodNumbers.length) {
      this.alert(
        'error',
        'Error',
        'El Archivo esta vació o tiene elementos inválidos'
      );
      return;
    }

    this.form.get('goodNum').setValue(goodNumbers);
  }

  private getFileFromEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const filename = file.name;
    return file;
  }

  isValidFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files.length) {
      return false;
    }
    if (target.files.length > 1) {
      this.alert('error', 'Error', 'Solo puede seleccionar un Archivo');
      return false;
    }
    const file = target.files[0];
    const filename = file.name;
    const extension = filename.split('.').at(-1);
    if (!extension) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    return true;
  }

  getGoodLabels(params: ListParams) {
    this.goodLabelService.getAll(params).subscribe({
      next: response =>
        (this.labels = new DefaultSelect(response.data, response.count)),
      error: () => {
        this.labels = new DefaultSelect([], 0);
      },
    });
  }

  getGoodStatuses(params: ListParams) {
    params.limit = 100;
    this.statusGoodService.getAll(params).subscribe({
      next: res => (this.goodStatuses = new DefaultSelect(res.data, res.count)),
      error: () => {
        this.goodStatuses = new DefaultSelect([], 0);
      },
    });
  }
}
