import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppUpdateDonationGoalComponent } from './app-update-donation-goal.component';

describe('AppUpdateDonationGoalComponent', () => {
  let component: AppUpdateDonationGoalComponent;
  let fixture: ComponentFixture<AppUpdateDonationGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUpdateDonationGoalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppUpdateDonationGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
