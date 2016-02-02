# hexo-generator-column

Column generator for [Hexo], you can build multi-column, such as 'News', 'Music', 'Blog' not only 'archive' in your website...

## Installation

``` bash
$ npm install hexo-generator-column --save
```

## Options

### site config
``` yaml
columns:
  - books
  - news
column_generator:
  per_page: 10
  yearly: true
  monthly: true
  daily: false
```

### theme config
``` yaml
# Header
menu:
  主页: .
  书店: books
  新闻: news
```

### in post.md, this post will auto has `layout: this.column`
``` yaml
---
title: bibihub incoming
column: books
date: 2016-01-27 15:29:24
---
```

### 

- **per_page**: Posts displayed per page. (0 = disable pagination)
- **yearly**: Generate yearly archive.
- **monthly**: Generate monthly archive.
- **daily**: Generate daily archive.

## License

MIT

[Hexo]: http://hexo.io/
