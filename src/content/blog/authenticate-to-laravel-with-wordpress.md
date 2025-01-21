---
title: "Authenticate to Laravel with WordPress"
slug: "authenticate-to-laravel-with-wordpress"
subtitle: ""
author: "Chris Arter"
publishDate: "2022-05-25T14:06:59.486Z"
dateUpdated: ""
---

I know what you're thinking.

"How do I use WordPress as an identity provider for Laravel Socialite." Oh, that wasn't your first thought? Well while we're here, I may as well share a great package that allows you to do just that. And if it was, then you're in the right place.

This package allows WordPress users to authenticate users to your Laravel application through [Socialite](https://laravel.com/docs/9.x/socialite). This can be useful when building support applications for businesses that have already invested in the user ecosystem of WordPress. Instead of having multiple logins, this allows us to use WordPress as the identity provider, ultimately allowing someone to use their WordPress email and password to authenticate to a Laravel Application.

Once this package is installed, we can declare the connection details in our `config/services.php`

```php
'wordpress' => [    
    'client_id' => env('WORDPRESS_CLIENT_ID'),  
    'client_secret' => env('WORDPRESS_CLIENT_SECRET'),  
    'redirect' => env('WORDPRESS_REDIRECT_URI') 
],
```

Next, we add our event listener to our `EventServiceProvider`

```php
protected $listen = [
    \SocialiteProviders\Manager\SocialiteWasCalled::class => [
        // ... other providers
        \SocialiteProviders\WordPress\WordPressExtendSocialite::class.'@handle',
    ],
];
```

Finally, we can now return this driver from a controller:

```php
return Socialite::driver('wordpress')->redirect();
```

The details we get back from WordPress on this user are:

*   id
*   nickname
*   name
*   email
*   avatar

Adding a `wordpress_user_id` to the `users` table in the corresponding Laravel application will also us to preserve the native primary key. So, that when we get a user back from WordPress, we can match it to the `wordpress_user_id` instead of other details that may change, such as, `email`.

For more details, check out the full [documentation](https://socialiteproviders.com/WordPress)

This WordPress Laravel Socialite provider is part of a large set of community supported open-source packages to allow authentication through providers like [Apple](https://socialiteproviders.com/Apple/), [Microsoft](https://socialiteproviders.com/Microsoft/), [Reddit](https://socialiteproviders.com/Reddit/), and even [TikTok](https://socialiteproviders.com/TikTok/). See the full list at https://socialiteproviders.com.