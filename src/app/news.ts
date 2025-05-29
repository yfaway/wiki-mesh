import { Component, Pipe, computed, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * A simple pipe to allow displaying raw HTML.
 * @see https://blog.angular-university.io/angular-innerhtml/
 */
@Pipe({
  name: "safeHtml",
  standalone: true,
})
export class SafeHtmlPipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

/**
 * Display the most read articles.
 */
@Component({
  selector: 'news',
  imports: [SafeHtmlPipe],
  templateUrl: './news.html',
})
export class NewsComponent {
  articles = signal(new Array<News>())
  loading = computed(() => this.articles().length == 0);
}

export interface News {
  story_in_html: string;
}

