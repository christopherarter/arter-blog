---
title: "Keep Your Laravel Routes Clean on Any Project Size"
slug: "keep-your-laravel-routes-clean-on-any-project-size"
subtitle: ""
author: "Chris Arter"
publishDate: "2021-02-06T15:05:02.647Z"
dateUpdated: ""
---

In this post, I'm going to show you how you can organize routes in various size projects. From small projects to large, I'll show you some techniques that have kept a growing monolith's routes in a manageable state.

### Route prefixing

The feature I rely on most when organizing routes is route prefixing. `Route::group()` is an incredibly powerful method for organizing routes. Let's use the example `/admin`.

#### Without prefixing

    Route::get('/admin', '\App\Http\Controllers\AdminController@index');
    Route::get('/admin/profile', '\App\Http\Controllers\AdminController@profile');
    Route::get('/admin/payments', '\App\Http\Controllers\AdminController@payments');
    

    Route::group(['prefix' => '/admin'], function () {
      Route::get('/', '\App\Http\Controllers\AdminController@index');
      Route::get('/profile', '\App\Http\Controllers\AdminController@profile');
      Route::get('/payments', '\App\Http\Controllers\AdminController@payments');
    });
    

Already, we're able to organize our routes by domain & responsibility. This also allows us to nest these groups for even tighter grouping & control:

    Route::group(['prefix' => '/admin'], function () {  
        Route::get('/', '\App\Http\Controllers\AdminController@index');
        Route::group(['prefix' => '/payments'], function() {
            Route::get('/', '\App\Http\Controllers\AdminController@payments');
            Route::get('/{payment}', '\App\Http\Controllers\AdminController@showPayment');
            Route::delete('/{payment}', '\App\Http\Controllers\AdminController@deletePayment');
        });
    });
    

### Middleware

The `Route::group()` method is also great for declaring middleware for an entire group. Let's use our last example. We can add the `auth` middleware to the entire group like this:

    Route::group( ['prefix' => '/admin', 'middleware' => ['auth'] ], function () {
      // routes here
    });
    

### Naming

* * *

#### 💡 TL;DR Why Naming Rocks

Naming your routes can provide _many_ benefits while writing your application. Just a quick tl;dr on why named routes are so important:

Let's say in our `profile.blade.php`, we've got a link to logout like so:

    <a href="/logout">Logout</a>
    

And our route is declared as

    Route::get('/logout', 'AuthController@logout');
    

This is fine, but if we change our route to

    Route::get('/auth/logout', 'AuthController@logout');
    

Suddenly, all the locations we hard coded that path will 404!

If we rely on naming instead, we can write our blade templates to use names using the `route()` helper. The actual path will update automatically.

    <a href="{!! route('logout'); !!}">Logout</a>
    

This will always work (provided we keep the same name) despite what we do with the path declared in the controller.

* * *

Back to our example, let's use naming to organize our routes:

    Route::group( ['prefix' => '/admin', 'as' => 'admin.' ], function () {
      Route::get('/', 'AdminController@index')->name('index');
    });
    

All routes in this group will inherit the `admin.` prefix. So the route declared in this example will be `admin.index`. This is a great way to keep your route naming organized by domain.

### Custom Route Files

On larger projects, it can be helpful to break up the routes file into separate files to separate responsibilities. In our example above, let's say our `/admin` domain has _really_ grown. It's probably time to create our own `/routes/admin.php`.

We start by creating a file, `/routes/admin.php`. Next we create a method on the `RouteServiceProvider.php` class:

        protected function mapAdminRoutes()
        {
            Route::prefix('admin')
            ->middleware(['web', 'auth'])
            ->as('admin.')
            ->group(base_path('routes/admin.php'));
        }
    

Then, all we do is register it by calling this method in the `map()` method on the `RouteServiceProvider`.

        public function map()
        {
            // ... 
            $this->mapAdminRoutes();
        }
    

### Get routing!

Tl;dr my main methods for organizing routes for Laravel apps of various sizes:

*   [Route Prefixing](https://laravel.com/docs/8.x/routing#route-group-prefixes)
*   [Route Name Prefixes](https://laravel.com/docs/8.x/routing#route-group-name-prefixes)
*   Custom route files