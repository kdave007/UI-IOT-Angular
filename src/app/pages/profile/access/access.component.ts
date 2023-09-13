import { Component, OnInit, Input } from '@angular/core';
import { NbGlobalPhysicalPosition, NbGlobalPosition, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import { ProfileService } from '../services/profile.service';
import { tap, finalize } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'ngx-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  @Input() userId : any;

  public showNewKeyRep: boolean = false;
  public showNewKey: boolean = false;
  public showPrevKey: boolean = false;

  public newMail: string = null;
  public newMailConfirm: string = null;
  public newMailKeyCheck: string = null;

  public oldKey: string = null;
  public newKey: string = null;
  public newKeyConfirm: string = null;

  public showPrevKeyMail: boolean = false;

  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 5000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = true;

  constructor(private toastrService: NbToastrService, private profileService: ProfileService) { }

  ngOnInit() {
  }

  public setNewKey(event: any){
    this.newKey = event.target.value;

    console.log(this.newKey);
  }

  public setNewKeyRep(event: any){
    this.newKeyConfirm = event.target.value;

    console.log(this.newKeyConfirm);
  }

  public setOldKey(event: any){
    this.oldKey = event.target.value;

    console.log(this.oldKey);
  }

  public setNewMail(event: any){
    this.newMail = event.target.value;

    console.log(this.newMail);
  }

  public setNewMailConfirm(event: any){
    this.newMailConfirm = event.target.value;

    console.log(this.newMailConfirm);
  }

  public setNewMailKeyCheck(event: any){
    this. newMailKeyCheck = event.target.value;

    console.log(this.newMailKeyCheck);
  }

  public saveKey(){
    if(this.newKey == null || this.oldKey == null || this.newKeyConfirm == null){
      this.showToast("danger", "Error", "Campos incompletos");
    }
    else if(this.newKey != this.newKeyConfirm){
      this.showToast("danger", "Error", "Las contraseñas no coinciden");
    }
    else{
      let ok: string;

      this.profileService.updateKey(this.userId, this.newKey, this.oldKey).pipe(
        tap(
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          error => ok = 'failed'
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          if(ok == "failed") {
            this.showToast("danger", "Contraseña incorrecta", "Error, verifique su contraseña");
          }
          else{
            this.showToast("success", "Contraseña actualizada", "Se actualizó corretamente la contraseña");

            this.newKey = null;
            this.oldKey = null;
            this.newKeyConfirm = null;
          }
        })
      ).subscribe(data => {});
    }    
  }

  public saveMail(){
    if(this.newMail == null || this.newMailConfirm == null || this.newMailKeyCheck == null){
      this.showToast("danger", "Error", "Campos incompletos");
      return;
    }
    else if(this.newMailConfirm != this.newMail){
      this.showToast("danger", "Error", "Los correos no coinciden");
      return;
    }

    let re = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    let ok: string;
    
    if (!re.test(this.newMailConfirm) || !re.test(this.newMail) ){
      this.showToast("danger", "Error", "Formato de correo inválido");
    } 
    else {
      this.profileService.updateEmail(this.userId, this.newMail, this.newMailKeyCheck).pipe(
        tap(
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          error => ok = 'failed'
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          if(ok == "failed") {
            this.showToast("danger", "Contraseña incorrecta", "Error, verifique su contraseña");
          }
          else{
            this.showToast("success", "Correo actualizado", "Se actualizó corretamente el correo");

            this.newMail = null;
            this.newMailConfirm = null;
            this.newMailKeyCheck = null;
          }
        })
      ).subscribe(data => {});
    }    
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = title ? `${title}` : '';

    this.index += 1;
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }
}
