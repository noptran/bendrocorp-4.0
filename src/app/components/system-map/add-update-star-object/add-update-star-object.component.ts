import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController, PickerController } from '@ionic/angular';
import { StarObject, StarObjectRule } from 'src/app/models/system-map.model';
import { FieldService } from 'src/app/services/field.service';
import { SystemMapService } from 'src/app/services/system-map.service';
import { Plugins } from '@capacitor/core';
import { FieldDescriptor } from 'src/app/models/field.model';
import { HttpErrorResponse } from '@angular/common/http';
import { PickerOptions, PickerColumnOption } from '@ionic/core';
import { Base64Upload } from 'src/app/models/misc.model';
import { Subscription } from 'rxjs';

const { Modals, Toast } = Plugins;

@Component({
  selector: 'app-add-update-star-object',
  templateUrl: './add-update-star-object.component.html',
  styleUrls: ['./add-update-star-object.component.scss'],
})
export class AddUpdateStarObjectComponent implements OnInit {
  // base objects and vars
  starObject: StarObject;
  formAction: string;
  dataSubmitted: boolean;

  // form needs
  starRules: StarObjectRule[] = [];
  starObjectTypes: FieldDescriptor[] = [];
  starObjects: StarObject[] = [];
  mappableItems: any[] = [];

  // loading indicator
  loadingIndicator: HTMLIonLoadingElement;

  constructor(
    private systemMapService: SystemMapService,
    private fieldService: FieldService,
    private modalController: ModalController,
    private pickerController: PickerController,
    private loading: LoadingController
  ) {
  }

  filterMappableItems() {
    if (this.starObjects && this.starRules && (this.starObject && this.starObject.object_type_id)) {
      // get the possible parents type ids
      const canMapList: string[] = this.starRules.filter(x => x.child_id === this.starObject.object_type_id).map(x => x.parent_id);

      // get the possible items that we could map to
      return this.starObjects
      .filter(x => canMapList.includes(x.object_type_id))
      .map(x => {
        return {
          id: x.id,
          title: `(${x.kind}) ${x.title}`
        };
      })
      .sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    }
  }

  fetchFieldsDescriptorsTypes() {
    // all objects
    this.systemMapService.listStarObjects().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.starObjects = results;
      }
    });

    // system object types
    this.fieldService.getField('0f65a426-aa0e-4589-88b6-6bb54247e0bf').subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.starObjectTypes = results;
      }
    });

    // rules
    this.systemMapService.getMappingRules().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.starRules = results;
      }
    });

    // TODO: Other stuff later for object specific fields through master
  }

  async showObjectTypePicker() {
      if (this.starObject && this.starObject.id) {
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
              const found = this.starObjectTypes.find(x => x.id === val.objectType.value);
              console.log(found);
              this.starObject.object_type_id = found.id;
            }
          }
        ],
        columns: [
          {
            name: 'objectType',
            options: this.starObjectTypes.map((val) => {
              return {
                text: val.title,
                value: val.id,
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


  async showParentPicker() {
    const opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Done',
          handler: (val) => {
            const found = this.starObjects.find(x => x.id === val.parent.value);
            console.log(found);
            this.starObject.parent_id = found.id;
          }
        }
      ],
      columns: [
        {
          name: 'parent',
          options: this.filterMappableItems().map((val) => {
            return {
              text: val.title,
              value: val.id,
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

  showObjectTypeSelection() {
    if (this.starObject && this.starObject.object_type_id) {
      return this.starObjectTypes.find(x => x.id === this.starObject.object_type_id).title;
    }
  }

  showParentSelection() {
    if (this.starObject && this.starObject.parent_id) {
      return this.starObjects.find(x => x.id === this.starObject.parent_id)?.title;
    }
  }

  clearParentSelection() {
    if (this.starObject) {
      this.starObject.parent_id = null;
    }
  }

  setPrimaryImage(event: Base64Upload) {
    this.starObject.new_primary_image = event;
  }

  valid(): boolean {
    if (this.starObject && (this.starObject.title && this.starObject.description && this.starObject.object_type_id)) {
      return true;
    } else {
      return false;
    }
  }

  async submitForm() {
    this.dataSubmitted = true;

    this.loadingIndicator = await this.loading.create({
      message: 'Loading'
    });
    await this.loadingIndicator.present();

    if (this.starObject.id) {
      this.systemMapService.updateStarObject(this.starObject).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.systemMapService.refreshData();
          this.dataSubmitted = false;
          this.loading.dismiss();
          this.modalController.dismiss();
        }
      });
    } else {
      this.systemMapService.addStarObject(this.starObject).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.systemMapService.refreshData();
          this.dataSubmitted = false;
          this.loading.dismiss();
          this.modalController.dismiss();
        }
      });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {
    if (this.starObject && this.starObject.id) {
      this.formAction = 'Update';
    } else {
      this.formAction = 'Create';
      this.starObject = {} as StarObject;
    }

    this.fetchFieldsDescriptorsTypes();
  }

}