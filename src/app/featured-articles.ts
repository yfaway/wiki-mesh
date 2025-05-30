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

  reset = () => {
    this.title.set("Loading...");
    this.thumbnailUrl.set('');
    this.description.set('');
    this.url.set('');
  }

  update = (aTitle: string, thumpnailUrl: string, description: string, url: string) => {
    this.title.set(aTitle);
    this.thumbnailUrl.set(thumpnailUrl);
    this.description.set(description);
    this.url.set(url);
  }
}