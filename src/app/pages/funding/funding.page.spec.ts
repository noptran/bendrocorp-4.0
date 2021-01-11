import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundingPage } from './funding.page';

describe('FundingPage', () => {
  let component: FundingPage;
  let fixture: ComponentFixture<FundingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FundingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
