---
title: "How to avoid all database calls using Spatie Response Cache package"
slug: "how-to-avoid-all-database-calls-using-spatie-response-cache-package"
subtitle: ""
author: "Chris Arter"
publishDate: "2020-12-24T12:19:14.706Z"
dateUpdated: ""
---

It's no secret I stan [Spatie](https://spatie.be/) packages. I'm convinced there must be something in the water over there in Belgium, because, all they seem to do is pump out quality package after quality package. And, the most impressive thing is that they're all incredibly well maintained.

Fanboy-ing aside, I noticed a gotcha when using the **Response Cache** package, specifically some custom route binding rules:

```php
// RouteServiceProvider.php

Route::bind('post', function($value) {
    return Post::where('slug', $value)->firstOrFail();
});
```

What the code above allows me to do is bind routes via the `slug` column in my database. so `/posts/my-awesome-post` would map to a post with `my-awesome-post` as the slug.

#### The problem

This is all well and good, however, despite caching this route, **we will still incur a database call**. This is because the route binding expressed above is run _before_ Spatie's cache middleware.

#### The workaround

The workaround for this is fetching the record from the controller action. This will allow the response to be truly cached.

```php
// PostsController.php 

public function show(string $slug)
{
    return Post::where('slug', $value)->firstOrFail();
}
```

While we lose the spiffy custom route model binding above, we prevent a database hit for each request.

This solution isn't perfect, and I'm open to other ways of doing it, but I wanted to put this out there should anyone else encounter the same quirk.

Happy coding!