import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-remittance-exportation',
  templateUrl: './remittance-exportation.component.html',
  styles: [],
})
export class RemittanceExportationComponent extends BasePage implements OnInit {
  coordinationsItems = new DefaultSelect();
  selectedCoordination: any = null;

  form: FormGroup = new FormGroup({});
  today: Date;
  maxDate: Date;
  minDate: Date;

  constructor(private fb: FormBuilder) {
    super();
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getCoordinations({ page: 1, text: '' });
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      coordination: [null, [Validators.required]],
      opcion: [null, [Validators.required]],
      goods: [null, [Validators.required]],
      event: ['', [Validators.required]],
      check1: [null, [Validators.required]],
      check2: [null, [Validators.required]],
    });
  }

  getCoordinations(params: ListParams) {
    if (params.text == '') {
      this.coordinationsItems = new DefaultSelect(
        this.coordinationsTestData,
        5
      );
    } else {
      const id = parseInt(params.text);
      const item = [this.coordinationsTestData.filter((i: any) => i.id == id)];
      this.coordinationsItems = new DefaultSelect(item[0], 1);
    }
  }

  selectCoordination(event: any) {
    this.selectedCoordination = event;
  }

  coordinationsTestData: any[] = [
    {
      no_delegacion: 0,
      descripcion: 'OFICINAS CENTRALES',
    },
    {
      no_delegacion: 1,
      descripcion: 'COORD. REGIONAL TIJUANA',
    },
    {
      no_delegacion: 2,
      descripcion: 'COORD. REGIONAL HERMOSILLO',
    },
    {
      no_delegacion: 3,
      descripcion: 'COORD. REGIONAL CIUDAD JUAREZ',
    },
    {
      no_delegacion: 4,
      descripcion: 'COORD. REGIONAL MONTERREY',
    },
    {
      no_delegacion: 5,
      descripcion: 'COORD. REGIONAL CULIACAN',
    },
    {
      no_delegacion: 6,
      descripcion: 'COORD. REGIONAL GUADALAJARA',
    },
    {
      no_delegacion: 7,
      descripcion: 'COORD. REGIONAL QUERETARO',
    },
    {
      no_delegacion: 8,
      descripcion: 'COORD. REGIONAL VERACRUZ',
    },
    {
      no_delegacion: 9,
      descripcion: 'COORD. REGIONAL TUXTLA GTZ',
    },
    {
      no_delegacion: 10,
      descripcion: 'COORD. REGIONAL CANCUN',
    },
    {
      no_delegacion: 11,
      descripcion: 'COORD. REGIONAL CENTRO',
    },
    {
      no_delegacion: 15,
      descripcion: 'DELEGACION MIGRACION',
    },
  ];
}
