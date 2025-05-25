import { Component, effect, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeaturedArticles } from './featured-articles';
import * as tokens from '../../tokens.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeaturedArticles],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly token = tokens.wikimedia
  readonly title = signal("N/A");

  featuredArticle = viewChild.required(FeaturedArticles);

  private currentDate = new Date();

  constructor() {
  }

  isOnToday = () => {
    return this.currentDate.getUTCDate() == new Date().getUTCDate();
  }

  displayToday = () => {
    this.currentDate = new Date();
    this.getData();
  };

  displayPrevDay = () => {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.getData();
  }

  displayNextDay = () => {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.getData();
  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    let normalizedMonth = this.currentDate.getUTCMonth() + 1 < 10 
        ? "0" + (this.currentDate.getUTCMonth() + 1).toString()
        : (this.currentDate.getUTCMonth() + 1).toString();
    let normalizedDay = this.currentDate.getUTCDate()< 10 
        ? "0" + this.currentDate.getUTCDate().toString() 
        : this.currentDate.getUTCDate().toString();
    let dateString = `${ this.currentDate.getUTCFullYear() }/${ normalizedMonth}/${ normalizedDay }`;

    let response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${dateString}`,
      {
          headers: {
              'Authorization': 'Bearer ' + this.token,
              'Api-User-Agent': 'test-angular'
          }
      }
    );
    response.json().then((value) => {
      console.log(value);
      this.title.set(value.mostread.articles[0].description)

      this.featuredArticle().update(value.tfa.titles.canonical, 
        value.tfa.thumbnail.source, value.tfa.description, value.tfa.content_urls.desktop.page);
    });
  }
}
