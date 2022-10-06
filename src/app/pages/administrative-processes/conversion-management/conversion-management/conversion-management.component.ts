import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { PasswordModalComponent } from '../password-modal/password-modal.component';

export interface Example{
  idConversion: number,
  date: Date,
  actaConversion: string,
  goods: GoodsExample
}

export interface GoodsExample{
  noBien: number,
  noExpediente: number,
  tipo: string,
  desStatus: string,
  actaER: any,
  description: string
}

@Component({
  selector: 'app-conversion-management',
  templateUrl: './conversion-management.component.html',
  styles: [
  ]
})
export class ConversionManagementComponent implements OnInit {

  
  //
  public goods: GoodsExample[] = [
    {
      noBien: 1,
      noExpediente: 1245,
      description: 'ASDADFSdfsdf',
      tipo:'derivado',
      actaER: 'dsdsdsd',
      desStatus: 'sdsdsd',
    },
    {
      noBien: 2,
      noExpediente: 222,
      description: 'ASDADFSdfsdf',
      actaER: 'mmmmm',
      tipo:'derivado',
      desStatus: 'sdsdsd',
    },
    {
      noBien: 3,
      noExpediente: 555,
      description: 'ASDADFSdfsdf',
      actaER: 'xxxxxxx',
      tipo:'derivado',
      desStatus: 'sdsdsd',
    }
  ]
  //
  public saved: boolean = true;
  //
  public good: GoodsExample;

  //Reactive Forms
  public form: FormGroup;
  // Variable para la contraseña
  private _password: string;

  public get idConversion() { return this.form.get('idConversion'); }
  public get noBien() { return this.form.get('noBien'); }
  public get date() { return this.form.get('date'); }
  public get tipo() { return this.form.get('tipo'); }
  public get noExpediente() { return this.form.get('noExpediente'); }
  public get actaConversion() { return this.form.get('actaConversion'); }
  public get desStatus() { return this.form.get('desStatus'); }
  public get actaER() { return this.form.get('actaER'); }
  public get description() { return this.form.get('description'); }
 // public get goods(){return this.form.controls['goods'] as FormArray;}

  constructor(private fb: FormBuilder) {  }

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
      idConversion: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      date: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      noExpediente: [null, [Validators.required]],
      actaConversion: [null, [Validators.required]],
      desStatus: [null, [Validators.required]],
      actaER: [null, [Validators.required]],
      description: [null, [Validators.required]]
      //goods: this.fb.array([])
    });
  }

  
  save() {
    this.idConversion.setValue(1245);
    this.date.setValue(new Date());
    this.saved = false;
    //this.showToast('success');
  }

  searchGoods(){
    const NoGood = Number(this.noBien.value);
    // buscar el bien
    this.goods.forEach(element=>{
      if (element.noBien === NoGood) {
        this.good = element;
      }
    });
    this.setValueGood(this.good);
  }
  
  setValueGood(good: GoodsExample){
    this.noExpediente.setValue(good.noExpediente);
    this.tipo.setValue(good.tipo);
    this.actaER.setValue(good.actaER);
    this.desStatus.setValue(good.desStatus);
    this.description.setValue(good.description);
  }

  openDialogPW(){
 
  }

/*   showToast(status: NbComponentStatus) {
    this.toastrService.show(status, 'Guardado exitoso !!', { status });
  } */

}
