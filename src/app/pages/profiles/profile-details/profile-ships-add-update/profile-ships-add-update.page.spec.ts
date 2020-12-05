import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileShipsAddUpdatePage } from './profile-ships-add-update.page';

describe('ProfileShipsAddUpdatePage', () => {
  let component: ProfileShipsAddUpdatePage;
  let fixture: ComponentFixture<ProfileShipsAddUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileShipsAddUpdatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileShipsAddUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
