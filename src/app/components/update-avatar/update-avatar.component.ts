import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character.model';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
const { FileSelector } = Plugins;

@Component({
  selector: 'app-update-avatar',
  templateUrl: './update-avatar.component.html',
  styleUrls: ['./update-avatar.component.scss'],
})
export class UpdateAvatarComponent implements OnInit {
  character: Character;
  avatarData: string;
  avatarSelected: boolean;
  constructor(
    private platform: Platform
  ) { }

  async selectAvatar() {
    const ext = ['images'];
    const selectedFile = await FileSelector.fileSelector({
      ext
    });

    console.log(selectedFile);
  }

  async ngOnInit() {
    if (!this.platform.is('mobile')) {
      await this.importModule('capacitor-file-selector');
    }
    this.avatarData = this.character.avatar_url;
  }

  async importModule(moduleName): Promise<any>{
    console.log("importing ", moduleName);
    const importedModule = await import(moduleName);
    console.log("\timported ...");
    return importedModule;
}

}
