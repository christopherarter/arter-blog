---
title: "Introducing Dream, an AI / ML Toolbox for Laravel"
slug: "introducing-dream-an-ai-ml-toolbox-for-laravel"
subtitle: ""
author: "Chris Arter"
publishDate: "2022-11-04T16:00:05.329Z"
dateUpdated: "2022-11-04T16:00:51.761Z"
---

Two weeks ago, I was playing with some ML ideas in a Laravel application. I didn't quite like the accuracy of a certain cloud provider's ML product, so I wanted to try another. To do this, I had to re-write the client implementation in my app for each provider.

There must be a better way, right?

Other projects like Laravel Cashier and various Laravel facades allow you to interact with a single API, but you can swap out the underlying drivers under the hood. I thought, why don't we have something similar for ML tasks?

Introducing: **Dream, an AI / ML toolbox for Laravel**

### Dream

What does Dream do? Dream is simply a Facade to an underlying class that allow you to do common ML tasks and return consistent responses, without having to re-write your application code. This allows you to write your application code once.

    $meme = Storage::get('meme.jpg');
    
    $sentiment = Dream::image($meme)->text()->sentiment();
    

The above code detects the text in an image with OCR, then analyzes the sentiment, all in a single line of code.

The `$sentiment` response also has helpers to make taking action on the sentiment easier:

    $sentiment->positive(); // true
    

Dream can also do text related NLP tasks, like determining key phrases:

    Dream::text('Laravel is a web application framework with expressive, 
    elegant syntax. We’ve already laid the foundation — freeing you to create 
    without sweating the small things.')
      ->phrases()
      ->pluck('text')
      ->toArray();
    
    // [
       //   "Laravel",
       //   "a web application framework",
       //   "expressive, elegant syntax",
       //   "the foundation —",
       //   "the small things",
    // ]
    

Or just determining what language a text is written in:

        Dream::text('¿Cuál es tu película favorita?')->language(); // 'es'
    

You may also combine these interchangeably. So the example meme from earlier, we can detect what language is in the image:

    $meme = Storage::get('meme.jpg');
    
    $sentiment = Dream::image($meme)->text()->language();
    

### See more

Dream is still very early. As of writing this, I only have one driver for AWS Comprehend & AWS Rekgonition, but I will be adding one for Azure's products. You can also create your own and mix & match services.

To see the repo: https://github.com/christopherarter/dream