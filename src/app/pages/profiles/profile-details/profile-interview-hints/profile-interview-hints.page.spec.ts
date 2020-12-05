import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileInterviewHintsPage } from './profile-interview-hints.page';

describe('ProfileInterviewHintsPage', () => {
  let component: ProfileInterviewHintsPage;
  let fixture: ComponentFixture<ProfileInterviewHintsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileInterviewHintsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInterviewHintsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
