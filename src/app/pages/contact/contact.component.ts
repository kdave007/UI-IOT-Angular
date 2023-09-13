import { Component, OnInit } from '@angular/core';
import { NbGlobalPhysicalPosition, NbGlobalPosition, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'ngx-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public _subject: string;
  public _description: string;

  private profileInfo;
  private userId;

  config: ToasterConfig;
  index = 1;
  destroyByClick = true;
  duration = 10000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = true;

  constructor(private toastrService: NbToastrService, private contactService: ContactService) { }

  ngOnInit() {
    let uI=localStorage.getItem('userInfo');

    this.profileInfo = JSON.parse(uI); 
    this.userId = Number( this.profileInfo['userId'] );
  }

  /**
   * @brief
   *  Actualiza el asunto
   * 
   * @param event 
   */
  updateSubject(event: any) {
    this._subject = event.target.value;

    console.log(this._subject);
  }

  /**
   * @brief
   *  Actualiza la descripcion
   * 
   * @param event 
   */
  updateDescription(event: any) {
    this._description = event.target.value;
  }

  /**
   * @brief
   *  Envia el mensaje
   */
  submitForm() {    
    if( this._subject == null || this._description == null ) {
      this.showToast("danger", "Campos incompletos", "Complete todos los campos");
    }
    else{
      this.contactService.sendMessage( this.userId, this._subject, this._description);

      this._subject = null;
      this._description = null;

      this.showToast("success", "Mensaje enviado", "Hemos recibido su solicitud, nos comunicaremos pronto con usted");
    }
  }

  /**
   * @brief
   *  Muestra un mensaje
   * @param type 
   * @param title 
   * @param body 
   */
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
