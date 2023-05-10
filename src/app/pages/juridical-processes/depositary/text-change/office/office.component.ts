import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IGoodJobManagement,
  ImanagementOffice,
} from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styles: [],
})
export class OfficeComponent extends BasePage implements OnInit {
  goodJobManagement = new Observable<IListResponse<IGoodJobManagement>>();

  comboOfficeFlayer: IGoodJobManagement[] = [];
  comboOffice: ImanagementOffice[] = [];
  objOffice: ImanagementOffice[] = [];

  form: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private serviceOficces: GoodsJobManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getAllOficceDocs();
    /*this.loadAllOficceDocs();
     console.log("     this.loadAllOficceDocs( )   ");
     console.log(JSON.stringify(this.comboOfficeFlayer));



*/
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      proceedingsNumber: [null, [Validators.required]],
      numberGestion: [null, [Validators.required]],
      flywheel: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      officio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      charge: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      addressee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphInitial: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphFinish: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      paragraphOptional: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionSender: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typePerson: [null, [Validators.required]],
      senderUser: [null, [Validators.required]],
      typePerson_I: [null, [Validators.required]],
      senderUser_I: [null, [Validators.required]],
      key: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      document: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      key_I: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      document_I: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }

  confirm() {
    this.loading = true;
    //console.log(this.checkedListFA,this.checkedListFI)
    console.log(this.form.value);
    setTimeout((st: any) => {
      this.loading = false;
    }, 5000);
  }

  onNumberGoodEnter() {
    let numberExpedinte = this.form.get('proceedingsNumber').value;
    if (this.comboOffice != null) {
      this.objOffice = this.comboOffice.filter(
        X => X.proceedingsNumber == numberExpedinte
      );

      if (this.objOffice.length > 0) {
        this.cleanFilters();
        this.form
          .get('numberGestion')
          .setValue(this.objOffice[0].managementNumber);
        this.form.get('flywheel').setValue(this.objOffice[0].flyerNumber);
        this.form.get('officio').setValue(this.objOffice[0].cveManagement);
        this.form.get('senderUser').setValue(this.objOffice[0].sender);
        this.form.get('addressee').setValue(this.objOffice[0].addressee);
        this.form.get('charge').setValue(this.objOffice[0].cveChargeRem);
        this.form.get('paragraphInitial').setValue(this.objOffice[0].text1);
        this.form.get('paragraphFinish').setValue(this.objOffice[0].text2);
        this.form.get('paragraphOptional').setValue(this.objOffice[0].text3);
      } else {
        this.onLoadToast(
          'error',
          'Error',
          'No existen registros con ese número'
        );
      }
    }
  }

  onNumberGestionEnter() {}
  onFlywheelEnter() {}
  onOfficioEnter() {}

  loadAllOficceDocs() {
    let params = new FilterParams();
    this.serviceOficces.getAllFiltered(params.getParams()).subscribe({
      next: response => {
        this.comboOfficeFlayer = [...response.data];
      },
      error: err => {
        console.log(err);
      },
    });
  }

  getAllOficceDocs() {
    this.serviceOficces.getAllOfficialDocument().subscribe({
      next: response => {
        this.comboOffice = response.data;
        console.log(
          '================= 2 getAllOficceDocs======\n\n     this.getAllOficceDocs( )   \n\n====  comboOffice  ==================='
        );
        console.log(JSON.stringify(this.comboOffice));
      },
      error: err => {
        console.log(err);
      },
    });
  }

  cleanFilters() {
    this.form.get('numberGestion').setValue('');
    this.form.get('flywheel').setValue('');
    this.form.get('officio').setValue('');
    this.form.get('senderUser').setValue('');
    this.form.get('addressee').setValue('');
    this.form.get('charge').setValue('');
    this.form.get('paragraphInitial').setValue('');
    this.form.get('paragraphFinish').setValue('');
    this.form.get('paragraphOptional').setValue('');
  }
}
