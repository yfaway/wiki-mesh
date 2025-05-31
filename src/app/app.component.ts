import { Component, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Controls } from './controls';
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
  imports: [RouterOutlet, Controls, FeaturedArticles, MostReadArticlesComponent, NewsComponent],
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

  resetComponents() {
    this.featuredArticle().reset()
    this.mostReadComponent().articles.set(new Array<MostReadArticle>());
    this.newsComponent().articles.set(new Array<News>());
  }

  updateComponents(value: any) {
    console.log(value);
    if ( value.tfa ) {
      this.featuredArticle().update(value.tfa.titles.canonical,
        value.tfa.thumbnail.source, value.tfa.description, value.tfa.content_urls.desktop.page);
    }

    if ( value.mostread ) {
      let articles: Array<MostReadArticle> = [];
      for (let article of value.mostread.articles) {
        let obj: MostReadArticle = {
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
    }

    if (value.news) {
      let newsArticles: Array<News> = [];
      for (let obj of value.news) {
        let news : News = {
          story_in_html: obj.story
        }
        newsArticles.push(news);
      }
      this.newsComponent().articles.set(newsArticles);
    }
  };
}