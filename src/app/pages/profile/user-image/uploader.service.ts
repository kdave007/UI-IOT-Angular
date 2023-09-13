import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpEvent, 
  HttpHeaders
} from "@angular/common/http";
import { map, tap, last, retryWhen } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { SERVER_URL } from '../../server';

@Injectable({
  providedIn: "root"
})
export class UploaderService {
  public progressSource = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  upload(file: File, userId: number) {
    let formData = new FormData();
    formData.append("image", file);

    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('1', '1');

    const httpOptions = {
  headers: new HttpHeaders({
    'id':  '2',
  })
};

    let req = new HttpRequest(
      "POST",
      SERVER_URL+"dispatch/user/profile_image.php",
      formData,
      {
        headers: new HttpHeaders({
          'user':  String(userId),
        }),
        reportProgress: true
      },
    );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap((envelope: any) => this.processProgress(envelope)),
      last()
    );
  }

  processProgress(envelope: any): void {
    if (typeof envelope === "number") {
      this.progressSource.next(envelope);
    }
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Subiendo file "${file.name}" de tamaño ${file.size}.`;
      case HttpEventType.UploadProgress:
        return Math.round((100 * event.loaded) / event.total);
      case HttpEventType.Response:
        return `La imagen de perfil fue actualizada correctamente`;
      default:
        return `Error al actualizar: ${event.type}.`;
    }
  }
}