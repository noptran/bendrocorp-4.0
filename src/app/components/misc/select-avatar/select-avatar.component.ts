import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Base64Upload } from 'src/app/models/misc.model';

@Component({
  selector: 'app-select-avatar',
  templateUrl: './select-avatar.component.html',
  styleUrls: ['./select-avatar.component.scss'],
})
export class SelectAvatarComponent implements OnInit {
  newAvatar: Base64Upload;
  dataChanged: boolean;
  centerImage = true;

  /**
   * You can this either a URI or a base 64 string
   */
  @Input() avatarData: string;
  /**
   * Change the title which appears on the buttons
   */
  @Input() avatarTitle = 'Avatar';
  /**
   * Controls whether or not the corners are rounded
   */
  @Input() rounded = true;
  /**
   * Returns the avatar data after a new selection (use example: (avatarUpdatedEvent)="callerMethod($event)")
   */
  @Output() avatarUpdatedEvent = new EventEmitter<Base64Upload>();

  constructor() { }

  selectAvatarWeb() {
    document.getElementById('webAvatarPicker').click();
  }

  async handleAvatarFileInput(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads
    const file = files.item(0);

    if (file) {
      // add the avatar information to the user object so it can be uploaded
      const base64Result = await this.getBase64(file);

      this.newAvatar = { name: file.name, type: file.type, size: file.size, base64: base64Result } as Base64Upload;

      if (this.newAvatar.type === 'image/jpeg') {
        // fix the type
        this.newAvatar.type = 'image/jpg';

        // fix the file name
        this.newAvatar.name = this.newAvatar.name.replace('jpeg', 'jpg');

        // fix the base64
        this.newAvatar.base64 = this.newAvatar.base64.replace('jpeg', 'jpg');
      }

      console.log(this.newAvatar);

      this.avatarData = base64Result as string;

      this.avatarUpdatedEvent.next(this.newAvatar);
    }
  }

  getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  ngOnInit() {
  }
}
