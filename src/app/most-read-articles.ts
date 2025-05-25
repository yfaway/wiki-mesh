import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * Display the most read articles.
 */

@Component({
  selector: 'most-read-articles',
  imports: [DecimalPipe],
  templateUrl: './most-read-articles.html',
})
export class MostReadArticlesComponent {
  articles = signal(new Array<MostReadArticle>())
  loading = computed(() => this.articles().length == 0);
}

export interface MostReadArticle {
  date: string;
  rank: number;
  views: number;
  namespace: string;
  title: string;
  description: string;
  url: string;
}