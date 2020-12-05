import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileServiceRecordPage } from './profile-service-record.page';

describe('ProfileServiceRecordPage', () => {
  let component: ProfileServiceRecordPage;
  let fixture: ComponentFixture<ProfileServiceRecordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileServiceRecordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileServiceRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
