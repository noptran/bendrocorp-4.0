import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TopGreebleComponent } from './top-greeble.component';

describe('TopGreebleComponent', () => {
  let component: TopGreebleComponent;
  let fixture: ComponentFixture<TopGreebleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopGreebleComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TopGreebleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
