import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BsModalRef } from "ngx-bootstrap/modal";
import { BasePage } from "src/app/core/shared";

@Component({
    selector: 'app-can-usu-sirsae',
    templateUrl: './can-usu-sirsae.component.html',
    styleUrls: []
})

export class CanUsuSirsaeComponent extends BasePage implements OnInit{
    formUsu: FormGroup
    user: any
    
    constructor(private fb: FormBuilder, private bsModel: BsModalRef){
        super()
    }

    ngOnInit(): void {
        this.prepareForm()
        console.log(this.user)
        this.formUsu.get('user').setValue(this.user)
    }
    
    private prepareForm(){
        this.formUsu = this.fb.group({
            user: [null],
            password: [null]
        })
    }

    //Gets
    get userForm(){
        return this.formUsu.get('user')
    }

    get password(){
        return this.formUsu.get('password')
    }

    close(){
        this.bsModel.hide()
    }
}