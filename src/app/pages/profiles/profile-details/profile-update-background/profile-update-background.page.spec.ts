import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileUpdateBackgroundPage } from './profile-update-background.page';

describe('ProfileUpdateBackgroundPage', () => {
  let component: ProfileUpdateBackgroundPage;
  let fixture: ComponentFixture<ProfileUpdateBackgroundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileUpdateBackgroundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateBackgroundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
