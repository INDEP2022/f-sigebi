import { Component, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ConvertiongoodService } from "src/app/core/services/ms-convertiongood/convertiongood.service";
import { BasePage } from "src/app/core/shared";
import { DefaultSelect } from "src/app/shared/components/select/default-select";

@Component({
    selector: 'app-pw',
    templateUrl: './pw.component.html',
    styles: []
})

export class PwComponent extends BasePage implements OnInit{
    //Reactive Forms
  form: FormGroup;    
  //Search conversion
  conversiones = new DefaultSelect()
  // Variable para la contraseña
  private _password: string;

  get idConversion(){
    return this.form.get('idConversion')
  }
  get password(){
    return this.form.get('password')
  }

    constructor(
        private fb: FormBuilder,
        private serviceConversion: ConvertiongoodService,
        private modalService: BsModalRef 
    ){
        super()
    }

    ngOnInit(): void {
        this.buildForm()
    }

    private buildForm(){
        this.form = this.fb.group({
            idConversion: [null, [Validators.required]],
            password: [null, [Validators.required]]
        })
    }

    serachIdConversion(e: any){
        this.serviceConversion.getById(e.text).subscribe(
            res => {
                console.log(res)
                this.conversiones = new DefaultSelect([res])
            },
            err => {
                this.alert('warning','No existen registros con el valor ingresado','')
                this.conversiones = new DefaultSelect()
            }
        )
    }

    sigin(){
        if(this.idConversion.value != null){
            this._password = this.idConversion.value.pwAccess
            if(this.password != null){
                if(this.password.value != this._password){
                    this.alert('warning', 'Contraseña incorrecta', 'Por favor verificar y volver a intentar')
                }else{
                    this.modalService.content.callback(this.idConversion.value)
                    this.modalService.hide()
                }
            }else{
                this.alert('warning','Debe introducir la contraseña','')
            }
        }else{
            this.alert('warning','Debe introducir un Id Conversión','')
        }
    }

    close(){
        
    }
}