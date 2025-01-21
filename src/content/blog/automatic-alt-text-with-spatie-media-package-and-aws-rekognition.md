---
title: "Automatic Alt Text With Spatie Media Package and AWS Rekognition"
slug: "automatic-alt-text-with-spatie-media-package-and-aws-rekognition"
subtitle: ""
author: "Chris Arter"
publishDate: "2021-01-01T19:08:30.304Z"
dateUpdated: ""
---

I recently implemented a feature in our API that automatically creates alt tags for all images uploaded with [Spatie Laravel-medialibrary](https://spatie.be/docs/laravel-medialibrary/v9/introduction). This allows all images added to automatically be tagged with AWS's Rekgonition API, saving our marketing team hundreds of hours per year.

### Getting Started

This is how the feature works:

1.  We start with `Spatie\MediaLibrary\MediaCollections\Events\MediaHasBeenAdded` event that fires when a new media item is added.
2.  Next, we listen for that event in our `AutoAltTagListener` listener class.
3.  Using Laravel's DI container, we will inject our `AltTagService` into the handler.
4.  That service will call AWS Rekognition API to provide the image tags for the image.

![Screen Shot 2021-01-01 at 1.43.10 PM.png](/images/1737473617711-srPH398Jm.png)

#### Could you handle everything in the listener?

Of course. But, we want to decouple the auto alt tagging logic into a service, so that we could use it in other areas of the application by registering a service provider.

### Step 0 - Setup AWS IAM permissions for AWS Rekgonition

For this service to work, the AWS credentials you've provided in your application need to have permissions to use the AWS Rekognition API.

### Step 1 - Add Rekognition Client Configs

So that you can follow along, I've organized this project to have the credentials for AWS Rekognition in our `config/services.php` file, under the index of `rekognition`:

```php
// config/services.php
// ...
    'rekognition'   => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
```

### Step 2 - Create the service

This portion is a bit up to you, but I like to create a `app/Services` folder. Assuming that structure, let's create a file `app/Services/AltTagService.php`

Within that file, this is what we want our service to look like:

```php
<?php

namespace App\Services;

use Aws\Credentials\Credentials;
use Aws\Rekognition\RekognitionClient;
use Illuminate\Support\Facades\Http;

class AltTagService
{
    protected $rekognition;

    public function __construct()
    {
        $rekognitionCreds  = config('services.rekognition');
        $credentials       = new Credentials($rekognitionCreds['key'], $rekognitionCreds['secret']);
        $this->rekognition = new RekognitionClient([
            'credentials'   => $credentials,
            'region'        => $rekognitionCreds['region'],
            'version'       => 'latest'
        ]);
    }

    public function getAltTags(string $url)
    {
        $response = Http::get($url);
        if($response->successful())
        {
            $result   = $this->rekognition->detectLabels([
                'Image' => [
                    'Bytes' => $response->body()
                ],
                'MaxLabels'     => 12,
                'MinConfidence' => 65.00,
            ]);
            $prefix = 'Image of ';
            return $prefix . collect($result->toArray()['Labels'])->implode('Name', ', ') . '.';
        }
    }
}
```

### Step 3 - Register Service Provider

We'll run

```bash
php artisan make:provider AltTagServiceProvider
```

This will create a file at `app/Providers/AltTagServiceProvider.php`

Then, we'll want this file to look like this:

```php
<?php

namespace App\Providers;

use App\Services\AltTagService;
use Illuminate\Support\ServiceProvider;

class AltTagServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(AltTagService::class, function ($app) {
            return new AltTagService();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
```

If you'd like to learn more about binding to the service container, check out [Binding Basics](https://laravel.com/docs/8.x/container#binding-basics)

Great! Now, we can access this service anywhere in the app through the container.

### Step 4 - Create the listener

Next, let's run:

```bash
php artisan make:listener Media/AutoAltTagListener
```

This will create a file in `app/Listeners/Media/AutoAltTagListener.php`.

Here's where we will call the service we registered above in the constructor of our listener in the following code:

```php
<?php

namespace App\Listeners\Media;

use App\Services\AltTagService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Spatie\MediaLibrary\MediaCollections\Events\MediaHasBeenAdded;

class AutoAltTagListener
{
    protected $altTagService;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(AltTagService $altTagService)
    {
        $this->altTagService = $altTagService;
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(MediaHasBeenAdded $event)
    {
        if (! $event->media->hasCustomProperty('alt')) {
            $event->media
            ->setCustomProperty('alt', $this->altTagService->getAltTags( $event->media->getUrl() ))
            ->save();
        }
    }
}
```

### Step 5 - Register the event listener

Nothing special here, we're just going to register the listener as we would any other in our `EventServiceProvider.php`:

```php
        Spatie\MediaLibrary\MediaCollections\Events\MediaHasBeenAdded::class => [
            \App\Listeners\Media\AutoAltTagListener::class
        ]
```

### Conclusion

You can now upload files with the Spatie media library. The alt tag should be available on any media model via the `getCustomProperty` method.

An example:

    $altTag = $myMediaModel->getCustomProperty('alt');
    

Enjoy!