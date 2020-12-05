import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileBackgroundPage } from './profile-background.page';

describe('ProfileBackgroundPage', () => {
  let component: ProfileBackgroundPage;
  let fixture: ComponentFixture<ProfileBackgroundPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileBackgroundPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileBackgroundPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
