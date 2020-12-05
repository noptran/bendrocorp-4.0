import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileApplicationPage } from './profile-application.page';

describe('ProfileApplicationPage', () => {
  let component: ProfileApplicationPage;
  let fixture: ComponentFixture<ProfileApplicationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileApplicationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileApplicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
