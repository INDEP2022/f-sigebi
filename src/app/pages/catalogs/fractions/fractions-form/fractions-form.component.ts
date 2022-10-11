import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IFraction } from 'src/app/core/models/catalogs/fraction.model';
import { INorm } from 'src/app/core/models/catalogs/norm.model';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { InstitutionClasificationService } from 'src/app/core/services/catalogs/institution-classification.service';
import { NormService } from 'src/app/core/services/catalogs/norm.service';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-fractions-form',
  templateUrl: './fractions-form.component.html',
  styles: [
  ]
})
export class FractionsFormComponent extends BasePage implements OnInit {

  fraction: IFraction;
  @Output() refresh = new EventEmitter<true>();
  fractionForm: ModelForm<IFraction>
  norms = new DefaultSelect<INorm>();
  clasifications = new DefaultSelect<ISiabClasification>();
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private fractionService: FractionService,
    private normService: NormService,
    private clasificationService:SIABClasificationService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(){
    this.fractionForm = this.fb.group({
      code: [null,[Validators.required]],
      level: [null,[Validators.required]],
      description: [null,[Validators.required]],
      normId: [null,[Validators.pattern("[0-9]{0,255}")]],
      unit: [null,[Validators.required]],
      clasificationId: [null,[Validators.required]],
      version: [null,[Validators.required, Validators.pattern("^([0-9]+)+([.][0-9]+)+([.][0-9]+)?$")]],
      relevantTypeId: [null,[Validators.required, Validators.pattern("[0-9]{0,255}")]],
      codeErp1: [null,[Validators.pattern("[a-z-A-Z]{0,30}")]],
      codeErp2: [null,[Validators.pattern("[a-z-A-Z]{0,30}")]],
      codeErp3: [null,[Validators.pattern("[a-z-A-Z]{0,30}")]],
      decimalAmount: [null,[Validators.pattern("[a-z-A-Z]{0,1}")]],
      status: [null],
      fractionCode: [null,[Validators.required, Validators.pattern("[0-9]{1,255}")]],
    });

    if(this.fraction != null){
      this.edit = true;
      this.fractionForm.patchValue(this.fraction);

      if(this.fraction.clasificationId || this.fraction.normId){
        this.fractionForm.controls.clasificationId.setValue((this.fraction.clasificationId as ISiabClasification).id);
        this.clasifications = new DefaultSelect([this.fraction.clasificationId], 1);

        this.fractionForm.controls.normId.setValue((this.fraction.normId as INorm).id);
        this.norms = new DefaultSelect([this.fraction.normId], 1);
      }

    }
  }

  getFractionSelect(params: ListParams){
    this.normService.getAll(params).subscribe( data => {
      this.norms = new DefaultSelect(data.data, data.count);
    });
  }

  getClasificationSelect(params: ListParams){
    this.clasificationService.getAll(params).subscribe( data => {
      this.clasifications = new DefaultSelect(data.data, data.count);
    })
  }

  confirm(){
    this.edit ? this.update() : this.create();
  }

  create(){
    this.loading = true;
    this.fractionService.create(this.fractionForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false),
    );
  }

  update(){
    this.fractionService.update(this.fraction.id, this.fractionForm.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  close(){
    this.modalRef.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
