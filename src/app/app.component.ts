import { Component, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FeaturedArticles } from './featured-articles';
import { MostReadArticle, MostReadArticlesComponent } from './most-read-articles';
import { News, NewsComponent } from './news';
import * as tokens from '../../tokens.json';

/**
 * The root component to control several sections:
 *   - Featured articles
 *   - Previous day's most read articles
 *   - Today's news
 */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DatePipe, FeaturedArticles, MostReadArticlesComponent, NewsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly token = tokens.wikimedia

  featuredArticle = viewChild.required(FeaturedArticles);
  mostReadComponent = viewChild.required(MostReadArticlesComponent);
  newsComponent = viewChild.required(NewsComponent);
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
    let normalizedMonth = this.currentDate().getUTCMonth() + 1 < 10 
        ? "0" + (this.currentDate().getUTCMonth() + 1).toString()
        : (this.currentDate().getUTCMonth() + 1).toString();
    let normalizedDay = this.currentDate().getUTCDate()< 10 
        ? "0" + this.currentDate().getUTCDate().toString() 
        : this.currentDate().getUTCDate().toString();
    let dateString = `${ this.currentDate().getUTCFullYear() }/${ normalizedMonth}/${ normalizedDay }`;

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
      this.featuredArticle().update(value.tfa.titles.canonical, 
        value.tfa.thumbnail.source, value.tfa.description, value.tfa.content_urls.desktop.page);

      let articles : Array<MostReadArticle> = [];
      for (let article of value.mostread.articles) {
        let obj : MostReadArticle = {
          date: article.date,
          rank: article.rank,
          views: article.views,
          namespace: article.namespace.text,
          title: article.titles.canonical,
          description: article.description,
          url: article.content_urls.desktop.page
        };

        articles.push(obj);
      }
      this.mostReadComponent().articles.set(articles);

      let newsArticles: Array<News> = [];
      for (let obj of value.news) {
        let news : News = {
          story_in_html: obj.story
        }
        newsArticles.push(news);
      }
      this.newsComponent().articles.set(newsArticles);
    });
  }
}