import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;


@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss'],
})
export class AddTagComponent implements OnInit {
  tagText: string;
  constructor(
    private modalController: ModalController
  ) { }

  formValid() {
    // validate
    if (this.tagText && this.tagText.length > 0 && /^[A-Za-z0-9 ]*$/.test(this.tagText)) {
      return true;
    } else {
      return false;
    }
  }

  async tryEnterSend(event: any) {
    if (this.formValid()) {
      this.dismissWithData();
    } else {
      await Toast.show({
        text: 'Tag invalid check your input'
      });
    }
  }

  dismissWithData() {
    this.modalController.dismiss(this.tagText);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

}
