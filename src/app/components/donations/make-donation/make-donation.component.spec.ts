import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MakeDonationComponent } from './make-donation.component';

describe('MakeDonationComponent', () => {
  let component: MakeDonationComponent;
  let fixture: ComponentFixture<MakeDonationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeDonationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MakeDonationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
