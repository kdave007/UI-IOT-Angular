import { Component, OnInit, Input } from "@angular/core";
import { UploaderService } from "./uploader.service";

@Component({
  selector: "ngx-user-image",
  templateUrl: "./user-image.component.html",
  styleUrls: ["./user-image.component.scss"]
})
export class UserImageComponent implements OnInit {
  @Input() userId : any;

  progress: number = 0;
  infoMessage: any;
  isUploading: boolean = false;
  file: File;
  validImage: boolean = false;

  imageUrl: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "Ninguna imagen seleccioanda";

  constructor(private uploader: UploaderService) {}

  ngOnInit() {
    this.uploader.progressSource.subscribe(progress => {
      this.progress = progress;
    });
  }

  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;
      this.validImage = true;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
      };
    }
  }

  onUpload() {
    this.infoMessage = null;
    this.progress = 0;
    this.isUploading = true;

    this.uploader.upload(this.file, this.userId).subscribe(message => {
      this.isUploading = false;
      this.infoMessage = message;
    });
  }
}