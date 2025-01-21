---
title: "Middleware for the Wordpress REST API"
slug: "middleware-for-the-wordpress-rest-api"
subtitle: ""
author: "Chris Arter"
publishDate: "2019-05-25T13:22:06.000Z"
dateUpdated: ""
---

When I originally began doing significant development around the Wordpress REST API, I was excited to finally get hands-on with it.

Then, it came to write "middleware". If you are unfamiliar with middleware in web development, it is simply a series of checks between the inbound request and your controller actions.

This is the way you can perform middleware checks according to the current WP Codex:

    <?php
    add_action( 'rest_api_init', function () {
      register_rest_route( 'myplugin/v1', '/author/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'my_awesome_func',
        'args' => array(
          'id' => array(
            'validate_callback' => 'is_numeric'
          ),
        ),
        'permission_callback' => function () {
          return current_user_can( 'edit_others_posts' );
        }
      ) );
    } );
    

All we're left with is `permission_callback` to pass in a function string, or closure as seen in the documentation.

I decided to dig into the source code and see if I could create a more familiar looking middleware.

### WP Middleware

That's when I created a `middleware()` helper.

This helper simply takes the `WP_REST_Request` from the `rest_pre_dispatch` filter and injects it as a parameter into the callback in the `rest_pre_dispatch` hook.

This allows you to write simple checks, with all of the objects you need all in one place:

    
    middleware()->get('/wp/v2/posts', ['check_foo', 'check_bar']);
    
    // callback check
    function check_foo($request) {
        if( $request->get_param('foo') != 'foo' ){
            return reject();
        }
    }
    
    // callback check
    function check_bar($request) {
        if( $request->get_param('bar') != 'bar' ){
            return reject();
        }
    }
    

Simply return the `reject()` function to reject the request and return a `401`. You can also pass custom rejection messages and response code.

    return reject("foo doesn't equal bar!", 400);
    

### Authorization

This also opens the door to allow for certain API operations based on external sources, e.g. using user tokens from Cognito, or approving or denying requests based on other token data in the request, like Stripe.

    middleware()->post('/wp/v2/stripe-webhook', ['stripe_check']);
    
    function stripe_check($request){
        // verify the webhook came from stripe
    }
    

### Middleware Stacks

This also allows you to create pre-described middleware stacks that allow for portable, consolidated check logic across your application.

    $middlewareStack = ['check_foo', 'check_bar'];
    
    middleware()->guard([
        '/wp/v2/posts',
        '/wp/v2/users' ], 
        $middlewareStack);
    

### Getting Started

For documentation, see the [ReadMe](https://github.com/christopherarter/WP-Middleware-Plugin/blob/master/readme.md).

To install this middleware as a plugin, use [GitHub](https://github.com/christopherarter/WP-Middleware-Plugin)

To install via composer: `composer require christopherarter/wp-middleware`