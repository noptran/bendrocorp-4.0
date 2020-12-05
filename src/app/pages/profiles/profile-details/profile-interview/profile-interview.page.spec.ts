import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileInterviewPage } from './profile-interview.page';

describe('ProfileInterviewPage', () => {
  let component: ProfileInterviewPage;
  let fixture: ComponentFixture<ProfileInterviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileInterviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInterviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
