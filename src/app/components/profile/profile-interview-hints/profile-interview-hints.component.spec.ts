import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileInterviewHintsComponent } from './profile-interview-hints.component';

describe('ProfileInterviewHintsComponent', () => {
  let component: ProfileInterviewHintsComponent;
  let fixture: ComponentFixture<ProfileInterviewHintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileInterviewHintsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInterviewHintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
