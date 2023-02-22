import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

/* interface IPerson {
  name: string;
  birthdate: Date | any;
}

interface IUser {
  username: string;
  person: IPerson;
  roles: IRole[];
}

interface IRole {
  role: string;
  description: string;
  status: string;
  labelNumber: string;
} */
@Component({
  selector: 'app-pa-cdgi-c-change-destination-goods-indicators',
  templateUrl: './pa-cdgi-c-change-destination-goods-indicators.component.html',
  styles: [],
})
export class PaCdgiCChangeDestinationGoodsIndicatorsComponent
  extends BasePage
  implements OnInit
{
  data: LocalDataSource = new LocalDataSource();
  form: FormGroup;
  goods: IGood[] = [];
  goodsNew: IGood[] = [];
  userExample: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  massive: boolean = false;
  index: number = 0;

  get targetIndicator() {
    return this.form.get('targetIndicator');
  }
  get goodId() {
    return this.form.get('goodId');
  }
  /*   get goodDescription() {
    return this.form.get('goodDescription');
  } */
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.actions = false;
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
      targetIndicator: [null, [Validators.required]],
      goodId: [null, [Validators.required]],
      goodDescription: [null, [Validators.required]],
    });
    this.userExample = this.fb.group({
      roles: this.fb.array([this.roleForm]),
      username: [''],
    });
  }
  addGood() {
    this.loading = true;
    let idGood: number = Number(this.goodId.value);
    if (this.validarGood(idGood)) {
      this.onLoadToast(
        'error',
        'Bien Duplicado',
        'Este bien ya esta registrado en la tabla'
      );
      this.loading = false;
      return;
    }
    this.goodServices.getById(idGood).subscribe({
      next: response => {
        this.goods.push(response);
        this.loading = false;
        this.data.load(this.goods);
        this.data.refresh();
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'Bien Duplicado', err.error.message);
        this.loading = false;
      },
    });
  }
  validarGood(idGood: number): boolean {
    console.log('Entro al if');
    let valid: boolean = false;
    this.goods.forEach(good => {
      if (Number(good.id) === idGood) {
        valid = true;
      }
    });
    return valid;
  }

  get roleForm() {
    return this.fb.group({
      role: [null],
      description: [null],
      status: [null],
      labelNumber: [null],
    });
  }

  get roles(): FormArray {
    return this.userExample.get('roles') as FormArray;
  }

  addRole() {
    this.index = this.index + 1;
    this.roles.push(this.roleForm);
  }

  removeRole(index: number) {
    this.roles.removeAt(index);
  }

  /*   saveRole() {
    this.user = this.userExample.getRawValue();
  } */
}
