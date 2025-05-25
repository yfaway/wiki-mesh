import { Component, signal } from '@angular/core';

@Component({
  selector: 'feature-articles',
  templateUrl: './featured-articles.html',
})
export class FeaturedArticles {
  title = signal("Loading...");
  thumbnailUrl = signal('');
  description = signal('');
  url = signal('');

  update = (aTitle: string, thumpnailUrl: string, description: string, url: string) => {
    this.title.set(aTitle);
    this.thumbnailUrl.set(thumpnailUrl);
    this.description.set(description);
    this.url.set(url);
  }
}