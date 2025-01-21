---
title: "Laravel chunk vs cursor methods compared"
slug: "laravel-chunk-vs-cursor-methods-compared"
subtitle: "When to use chunk(), and when to use cursor()"
author: "Chris Arter"
publishDate: "2023-03-23T10:47:00.664Z"
dateUpdated: "2024-05-14T14:51:45.541Z"
---

When working with large datasets in Laravel, efficiently managing memory usage is essential. Eloquent provides two powerful methods, `cursor()` and `chunk()`, to assist in retrieving and processing these large datasets. But how do they differ, and which should you choose for your specific use case? I most commonly use `chunk()` but recently took a dive into `cursor()` to compare. In this blog post, we'll compare `cursor()` and `chunk()` to help you make an informed decision, so you don't melt your $5 Digital Ocean droplet 🙃

### Writing queries like a caveman

![so easy a caveman can do it ](/images/1737473617709-c45f5716-cf14-4258-91dd-27bb470529eb.jpeg)

Let's talk about how we iterate over rows in a database like a caveman:

```php
use App\Models\User;

foreach (User::all() as $user) {
    // Process the user record
}
```

This is fine, but this will load _all_ of our records in memory. Even if we constrain our query with a few `where` clauses, it will still load the entire data set into memory. How can we iterate over a query result without loading _all_ of them into memory?

Here are two approaches:

### Understanding `chunk()`

![image of chunky cat](/images/1737473618069-e7e389aa-ad15-4ef8-9e67-17e6114c314d.jpeg)

The `chunk()` method retrieves and processes records in "chunks" or groups, allowing you to define the number of records to load into memory at a time. This method is useful when you need to perform memory-intensive operations on large datasets without causing your application to crash.

Here's an example of using the `chunk()` method:

```php
use App\Models\User;

User::chunk(200, function ($users) {
    foreach ($users as $user) {
        // Process the user record
    }
});

// This is the same as:

$users = User::limit(200)->get();
foreach($users as $user)
{
   // Process the user record
}

$users = User::skip(200)->limit(200)->get();
foreach($users as $user)
{
   // Process the user record
}

$users = User::skip(400)->limit(200)->get();
foreach($users as $user)
{
   // Process the user record
}
```

Notice we're just grabbing users in increments of 200 as an entire "chunk" in a single query. This allows us to only do 1 DB query for 200 rows.

Pros of using `chunk()`:

1.  Controlled memory usage: You can define the number of records to load into memory at a time.
    
2.  Faster execution: Fetching records in chunks can lead to faster processing times compared to fetching them individually.
    

Cons of using `chunk()`:

1.  More complex implementation: The `chunk()` method requires a callback function and a specified chunk size. This also requires you to loop back over that subset of results in the chunk (not a big deal but just worth noting).

### Understanding `cursor()`

[via GIPHY](https://giphy.com/gifs/season-8-the-simpsons-8x8-l0G18VKQy7UOU3eJW)

The `cursor()` method in Laravel Eloquent uses a [Generator](https://www.php.net/manual/en/language.generators.overview.php) to fetch records one at a time, allowing you to iterate over large datasets without loading the entire result set into memory. The main use case for this is when processing data sources with potentially millions of rows (you go on with yo bad self!)

Here's an example of using the `cursor()` method:

```php
use App\Models\User;

foreach (User::cursor() as $user) {
    // Process the user record
}

// This is same as:

$user = User::find(1);
// Process the user record

$user = User::find(2);
// Process the user record
```

The key difference is cursor will the results from the DB, and processes it one by one.

**Pros of using**`cursor()`**:**

1.  Efficient memory usage: Since records are streamed and only one eloquent model is hydrated in memory, memory usage remains low.
    
2.  Simple implementation: The `cursor()` method is easy to implement in your code.
    

**Cons of using**`cursor()`**:**

1.  Slower execution: Since records are fetched individually, processing time can be slower compared to other methods.

### `cursor()` vs `chunk()`: Which One to Choose?

When deciding between `cursor()` and `chunk()`, consider the following factors:

1.  Memory usage: If you want to keep memory usage as low as possible, go with `cursor()`. If you're comfortable with higher memory usage and want faster execution, `chunk()` is a better choice. Just keep in mind you'll be trading memory for _N_ number of queries. So instead of 10 queries returning 10 results each with `chunk()`, you'll make 100 queries with 1 result each. This will place this workload on your database (which can be fine).
    
2.  Execution speed: `chunk()` can potentially offer faster execution times as it processes records in batches, while `cursor()` fetches them one at a time.
    
3.  Implementation complexity: If you prefer a simple implementation, `cursor()` is easier to implement compared to `chunk()`.
    

### Conclusion

The method I see most often in the wild is `chunk()`, and it's the tool I reach for most often when processing a large data set. But, I was recently curious about `cursor()` so I took a little dive and decided to share it with you all.

Drop a comment if you use `cursor()` often, I'm curious about the real world usecases.

_Images copyright Geico_