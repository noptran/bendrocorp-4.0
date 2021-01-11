import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JoinSupporterComponent } from './join-supporter.component';

describe('JoinSupporterComponent', () => {
  let component: JoinSupporterComponent;
  let fixture: ComponentFixture<JoinSupporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinSupporterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JoinSupporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
