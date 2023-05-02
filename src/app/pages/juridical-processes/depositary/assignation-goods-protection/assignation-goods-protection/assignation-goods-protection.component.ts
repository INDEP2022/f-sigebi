/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Example } from 'src/app/core/models/catalogs/example';

/** SERVICE IMPORTS */
import { ExampleService } from 'src/app/core/services/catalogs/example.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { BehaviorSubject } from 'rxjs';
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ProtectionService } from 'src/app/core/services/ms-protection/protection.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

type SuspensionType = 'PROVISIONAL' | 'DEFINITIVA' | 'DE PLANO' | '';
@Component({
  selector: 'app-assignation-goods-protection',
  templateUrl: './assignation-goods-protection.component.html',
  styleUrls: ['./assignation-goods-protection.component.scss'],
})
export class AssignationGoodsProtectionComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    selectedRowIndex: -1,
    columns: {
      goodId: {
        title: 'No. Bien',
        sort: false,
      }, //*
    },
  };
  // Data table 1
  dataTable: IGood[] = [];
  private data: IGood[] = [];
  private data2: IGood[] = [];
  tableSettings2 = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    selectedRowIndex: -1,
    columns: {
      goodId: {
        title: 'No. Bien',
        sort: false,
      }, //*
    },
  };
  // Data table 2
  dataTable2: IGood[] = [];
  items = new DefaultSelect<Example>();
  minItems = new DefaultSelect<IMinpub>();
  courtItems = new DefaultSelect<ICourt>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems = 0;
  goodAdd: IGood;
  goodRemove: IGood;
  public form: FormGroup;
  public formTipoSuspersion: FormGroup;
  public formAmparo: FormGroup;

  constructor(
    private fb: FormBuilder,
    private exampleService: ExampleService,
    private goodService: GoodService,
    private protectionService: ProtectionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]], //* id
      preliminaryInquiry: [null, [Validators.pattern(STRING_PATTERN)]], // Preliminary Inquiry
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]], // Criminal Case
      protectionKey: [null],
    });
    this.formTipoSuspersion = this.fb.group({
      suspensionType: '', // Provisional, Definitiva, De plano
      previous_report_date: [new Date()],
      justificado: ['', [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    this.formAmparo = this.fb.group({
      amparo: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      protectionType: [null, [Validators.required]], //* Directo, Indirecto
      officialDate: [new Date()],
      no_minpub: [null], // Detalle Min. Pub.
      court_number: [null], // Detalle No Juzgado
      responsable: '',
      delegacion: '', // 4 campos con el primero en id
      complainers: [null, [Validators.pattern(STRING_PATTERN)]],
      act_claimed: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  expedientSelect(expedient: IExpedient) {
    this.form.patchValue(expedient);
    if (expedient) {
      this.getData(this.form.value);
    }
    this.dataTable = [];
    this.dataTable2 = [];
    this.data = [];
    this.data2 = [];
  }

  private getData(val: any) {
    console.log(val);
    let params = new ListParams();
    params.limit = 5;
    params.page = 1;
    params.text = '';
    if (val.id) {
      this.goodService.getByExpedient(val.id, params).subscribe({
        next: value => {
          this.dataTable = [...value.data];
          this.data = [...this.dataTable];
          console.log(this.data);
        },
      });
    }
    if (val.protectionKey) {
      this.protectionService.getByIdNew(val.protectionKey).subscribe({
        next: value => {
          let amparo: any = value.data;
          this.formAmparo.patchValue(amparo);
          this.minItems = new DefaultSelect([amparo.no_minpub]);
          this.formAmparo.get('no_minpub').patchValue(amparo.no_minpub.id);
          this.courtItems = new DefaultSelect([amparo.court_number]);
          this.formAmparo
            .get('court_number')
            .patchValue(amparo.court_number.id);
          this.formTipoSuspersion.patchValue(amparo);
          this.formTipoSuspersion
            .get('suspensionType')
            .patchValue(this.setSuspensionType(amparo));
        },
      });
    }
  }

  private setSuspensionType(amparo: any): SuspensionType {
    if (amparo.definitive_suspension) {
      return 'DEFINITIVA';
    } else if (amparo.plane_suspension) {
      return 'DE PLANO';
    } else if (amparo.provisional_suspension) {
      return 'PROVISIONAL';
    } else {
      return '';
    }
  }

  mostrarInfo(): any {
    console.log(this.form.value);
  }

  selectGoodTable1({ data, isSelected }: any) {
    if (isSelected) {
      this.goodAdd = data;
    }
  }
  selectGoodTable2({ data, isSelected }: any) {
    console.log(isSelected);

    if (isSelected) {
      this.goodRemove = data;
    }
  }

  btnAgregar() {
    if (this.goodAdd) {
      this.data2.push(this.goodAdd);
      this.data.splice(
        this.data.findIndex(item => item.id === this.goodAdd.id),
        1
      );
      this.dataTable = [...this.data];
      this.dataTable2 = [...this.data2];
      console.log('Agregar');
      this.goodAdd = null;
    }
  }

  btnEliminar() {
    if (this.goodRemove) {
      this.data.push(this.goodRemove);
      this.data2.splice(
        this.data2.findIndex(item => item.id === this.goodRemove.id),
        1
      );
      this.dataTable = [...this.data];
      this.dataTable2 = [...this.data2];
      console.log('Eliminar');
      this.goodRemove = null;
    }
  }

  getFromSelect(params: ListParams) {
    this.exampleService.getAll(params).subscribe(data => {
      this.items = new DefaultSelect(data.data, data.count);
    });
  }
}
