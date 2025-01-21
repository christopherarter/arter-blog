---
title: "Introducing WP Events, a simple event listener pattern for WordPress"
slug: "introducing-wp-events-a-simple-event-listener-pattern-for-wordpress"
subtitle: ""
author: "Chris Arter"
publishDate: "2021-01-02T22:43:17.292Z"
dateUpdated: "2021-01-17T01:16:04.507Z"
---

### Update:

I've archived this repo. While it is dependency-free, it's very similar to Wordpress' native filters & action features. Given that they're core to WP, I would advise using them instead of this package.

* * *

I started the year off by open-sourcing a helper I wrote for a previous project. I've been using this helper in other projects ever since.

**WP Events** is a super-simple event / listener pattern library for Wordpress and other applications. Example use:

### Declaring events

```php
wp_events_register([
    ...
    'user_signup' => [
        'send_welcome_email',
        'send_slack_notification'
    ],
]);
```

In this example, the `user_signup_event` will call the `send_welcome_email` and `send_slack_notification` listeners. It will also deliver a payload to each listener.

### Dispatching events

Using the example above, this is how we can dispatch an event anywhere in our application.

```php
wp_events_dispatch('user_signup', $email);
```

### Handling events in listeners

Next, each listener we registered will be provided the payload from our `wp_events_dispatch()` function.

```php
function send_welcome_email($email)
{
    // do something with $email
}

function send_slack_notification($email)
{
    // do something with $email
}
```

### Multiple inputs

This can also handle multiple inputs:

```php
wp_events_dispatch('user_signup', $name, $email);
```

Which you can accept in your listeners:

```php
function send_slack_notification($name, $email)
{
    // do something with $name and $email
}
```

This allows you to write event / listener patterns in Wordpress. While I wrote this in and for a Wordpress project, it can be used in any PHP application. It does not have any dependencies on Wordpress whatsoever.

PRs welcome! View the repo here: https://github.com/christopherarter/wp-events