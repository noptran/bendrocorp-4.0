import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PickerController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { Field, FieldValue } from 'src/app/models/field.model';
import { FieldService } from 'src/app/services/field.service';
import { PickerOptions, PickerColumnOption } from '@ionic/core';

@Component({
  selector: 'app-field-value-editor',
  templateUrl: './field-value-editor.component.html',
  styleUrls: ['./field-value-editor.component.scss'],
})
export class FieldValueEditorComponent implements OnInit {
  @Input() masterId: string;
  @Input() fields: Field[];
  @Input() fieldValues: FieldValue[];
  isMobile: boolean;

  constructor(
    private fieldService: FieldService,
    private authService: AuthService,
    private platform: Platform,
    private pickerController: PickerController
  ) { }

  valueForField(fieldId: string): string {
    if (this.fieldValues) {
      const findIndex = this.fieldValues.findIndex(x => x.field_id === fieldId);
      if (findIndex !== -1) {
        return this.fieldValues[findIndex].value;
      }
    }
  }

  validFields(): Field[] {
    if (this.fields) {
      return this.fields.filter(x => !x.read_only);
    }
  }

  fieldChange(event: any, fieldId: string) {
    console.log(event);
    console.log(fieldId);

    const value = event.detail.value;

    if (this.fieldValues) {
      const findIndex = this.fieldValues.findIndex(x => x.field_id === fieldId);
      if (findIndex !== -1) {
        this.fieldValues[findIndex].value = value;
      } else {
        this.fieldValues.push({
          master_id: this.masterId,
          field_id: fieldId,
          value
        } as FieldValue);
      }

      console.log(this.fieldValues);
    }
  }

  async submitFieldsForm(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.fields.length > 0) {
        this.fieldService.addUpdateFieldValue(this.fieldValues).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            resolve();
          } else {
            console.error(results.error.message);
            reject();
          }
        });
      } else {
        resolve();
      }
    });
  }

  async showValuePicker(field: Field) {
    if (!(field && field.descriptors)) {
      return;
    }

    const opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done',
          handler: (val) => {
            this.fieldChange({ detail: { value: val.fieldChoice.value } }, field.id);
          }
        }
      ],
      columns: [
        {
          name: 'fieldChoice',
          options: field.descriptors.map((val) => {
            return {
              text: val.title,
              value: val.title,
            } as PickerColumnOption;
          })
        }
      ]
    };
    const picker = await this.pickerController.create(opts);
    picker.present();
    picker.onWillDismiss().then(async data => {
    });
  }

  ngOnInit() {
    console.log('loaded fields editor');

    this.isMobile = this.platform.is('capacitor') && (this.platform.is('ios') || this.platform.is('android'));

    if (!this.fields) {
      throw new Error('You must pass this component a set of fields');
    }

    if (!this.masterId) {
      throw new Error('You must pass this component a valid masterId');
    }

    if (!this.fieldValues) {
      throw new Error('You must pass this component a set of field values (even if its empty)');
    }
  }

}
