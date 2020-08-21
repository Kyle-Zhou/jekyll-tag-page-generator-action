
# Tag Page Generator for Jekyll Blogs

## How to use

## Sample workflow

```yml
name: Generate the set of tag pages.
on:
  workflow_dispatch:

jobs:
  generate-tag-pages:
    name: Generate the set of tag pages.
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: hendrixjoseph/jekyll-tag-page-generator-action@master
        with:
          source: "https://www.joehxblog.com/data/tags.json"
          destination: "./tags/"
```

## Prerequisites

```json
---
---

{% assign tags = site.tags | sort %}
{"tags":[{% for tag in tags %}
{"name":"{{ tag[0] }}","slug":"{{ tag[0] | replace: ' ', '-' }}","postcount":{{ tag[1] | size }}}{% unless forloop.last %},{% endunless %}{% endfor %}]}
```


```html
---
layout: default
---

<span class="posts">
{% for post in site.tags[page.tag] %}<article class="post">
<h2 class="post-header">
<a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
</h2>
<hr />
<div>
<span class="date">{{ post.date | date: "%B %e, %Y" }}</span>
<nav class="tags">{% assign tags = post.tags | sort %}{% for tag in tags %}<a href="/tags/{{ tag | replace:' ','-' }}/">{{ tag }}</a>{% unless forloop.last %}|{% endunless %}{% endfor %}</nav>
</div>
<hr />
<div class="sample entry">
{{ post.excerpt }}
</div>     
</article>
{% endfor %}
</span>
```