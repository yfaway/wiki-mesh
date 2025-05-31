import { Output, Component, EventEmitter, signal } from '@angular/core';
import { DatePipe, NgFor } from '@angular/common';
import * as tokens from '../../tokens.json';
import { FormsModule } from '@angular/forms';

/**
 * Contains the button to navigate the day.
 */

@Component({
  selector: 'controls',
  imports: [DatePipe, FormsModule, NgFor],
  templateUrl: './controls.html',
})
export class Controls {
  @Output() dataAvailable = new EventEmitter<Object>();
  @Output() dataReset = new EventEmitter<void>();

  readonly token = tokens.wikimedia

  currentDate = signal(new Date());
  selectedValue = "en";

  supportedLanguages = [
    { "id": "bs", "name": "Bosanski" },
    { "id": "da", "name": "Danskomponent" },
    { "id": "de", "name": "Deutsch" },
    { "id": "el", "name": "Ελληνικά" },
    { "id": "en", "name": "English" },
    { "id": "es", "name": "Español" },
    { "id": "fi", "name": "Suomi" },
    { "id": "fr", "name": "Français" },
    { "id": "he", "name": "עברית" },
    { "id": "ko", "name": "한국어" },
    { "id": "no", "name": "Norsk" },
    { "id": "pl", "name": "Polski" },
    { "id": "pt", "name": "Português" },
    { "id": "ru", "name": "Русский" },
    { "id": "sco", "name": "Scots" },
    { "id": "sv", "name": "Svenska" },
    { "id": "vi", "name": "Tiếng Việt" },
  ];

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

  updateLanguageId = () => {
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

    let storageKey = `${this.selectedValue}_${dateString}`
    let storedData = sessionStorage.getItem(storageKey);
    if ( storedData == null ) {
      let response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/${this.selectedValue}/featured/${dateString}`,
        {
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Api-User-Agent': 'test-angular'
            }
        }
      );
      response.json().then((value) => { 
        sessionStorage.setItem(storageKey, JSON.stringify(value))
        this.dataAvailable.emit(value);
      });
    } else {
      this.dataAvailable.emit(JSON.parse(storedData));
    }
  }
}