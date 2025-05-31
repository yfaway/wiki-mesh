import { Output, Component, EventEmitter, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as tokens from '../../tokens.json';

/**
 * Contains the button to navigate the day.
 */

@Component({
  selector: 'controls',
  imports: [DatePipe],
  templateUrl: './controls.html',
})
export class Controls {
  @Output() dataAvailable = new EventEmitter<Object>();
  @Output() dataReset = new EventEmitter<void>();

  readonly token = tokens.wikimedia

  currentDate = signal(new Date());

  constructor() {
  }

  isOnToday = () => {
    return this.currentDate().getUTCDate() == new Date().getUTCDate();
  }

  displayToday = () => {
    this.currentDate.set(new Date());
    this.getData();
  };

  displayPrevDay = () => {
    this.currentDate().setDate(this.currentDate().getDate() - 1);
    // need to create a new Date obj; otherwise Angular won't update the dynamic rendering
    this.currentDate.set(new Date(this.currentDate().getTime()));

    this.getData();
  }

  displayNextDay = () => {
    this.currentDate().setDate(this.currentDate().getDate() + 1);
    // need to create a new Date obj; otherwise Angular won't update the dynamic rendering
    this.currentDate.set(new Date(this.currentDate().getTime()));

    this.getData();
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.dataReset.emit();

    let normalizedMonth = this.currentDate().getUTCMonth() + 1 < 10 
        ? "0" + (this.currentDate().getUTCMonth() + 1).toString()
        : (this.currentDate().getUTCMonth() + 1).toString();
    let normalizedDay = this.currentDate().getUTCDate()< 10 
        ? "0" + this.currentDate().getUTCDate().toString() 
        : this.currentDate().getUTCDate().toString();
    let dateString = `${ this.currentDate().getUTCFullYear() }/${ normalizedMonth}/${ normalizedDay }`;

    let storedData = sessionStorage.getItem(dateString);
    if ( storedData == null ) {
      let response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${dateString}`,
        {
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Api-User-Agent': 'test-angular'
            }
        }
      );
      response.json().then((value) => { 
        this.dataAvailable.emit(value);
        sessionStorage.setItem(dateString, value.stringify())
      });
    } else {
      this.dataAvailable.emit(JSON.parse(storedData));
    }
  }
}