---
title: "How to Integrate Laravel Sanctum with Spatie Permissions"
slug: "how-to-integrate-laravel-sanctum-with-spatie-permissions"
subtitle: "Use a single source of truth for your user permissions.  One rules set to rule them all."
author: "Chris Arter"
publishDate: "2024-12-23T16:56:49.653Z"
dateUpdated: "2025-01-10T14:46:54.138Z"
---

In this article, I’m going to show you a simplified setup of how I’ve used Spatie [Roles & Permissions](https://spatie.be/docs/laravel-permission/v6/introduction) package with [Laravel Sanctum.](https://laravel.com/docs/11.x/sanctum) This will allow users Sanctum tokens to respect the user’s abilities through this package.

Why?
----

Roles and permissions is a widely used package for determining authorization within your application. I treat a user’s abilities through its role as the source of truth for what this user can or cannot do.

By default, sanctum allows for `*` ability, which means this token has cart blanche across any middleware checks.

You can also pass explicit permissions to the token:

```php
$user->createAccessToken('some-token', ['view:protected-rotue'])->plainTextToken
```

The abilities of a token are _specific to that given token_, so regardless of the user the token belongs to, the token can do anything in its capabilities column.

This introduces scenarios where we may not give a user the permission to do an action, but in creating a token for this user, they may be able to perform those actions through their API token.

In effect, we’d be maintaining **_two authorization systems._** Life is too short to work that hard.

💡

By default, abilities are stored in the `abilities` column in the `personal access tokens` table.

How to sync with Spatie Permissions
-----------------------------------

Basically, we’re going to override how Laravel’s default `PersonalAccessToken` class looks up a token’s capabilities and defer to its `tokenable` model’s capabilities. The `tokenable` model is our `User` model by default.

### Install Roles & Permissions + Sanctum

To begin, you should have both Spatie Roles & Permissions installed, as well as Laravel Sanctum.

During installation, make sure you:

*   Apply the `HasRoles` and `HasApiTokens` traits to the User model.
    
*   Publish the configurations and run all applicable migrations.
    
*   If your user model is using UUIDs, then be sure to [configure your migrations.](https://spatie.be/docs/laravel-permission/v6/advanced-usage/uuid)
    

### Extend the Personal Access Token

The Sanctum docs detail how to override the Personal Access Token model [here.](https://laravel.com/docs/11.x/sanctum#overriding-default-models)

Following the same pattern, create a new file in `/app/Models/CustomToken.php` This is the new model Sanctum will use to manage tokens.

```php
<?php

    namespace App\Models;
    
    use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
    
    class CustomToken extends SanctumPersonalAccessToken
    {
        public $table = 'personal_access_tokens';
    
        public function can($ability)
        {
            return $this->tokenable->can($ability);
        }
    }
```

This class is overriding the `can()` method. Originally, the method does a look up on the token’s abilities column. Our class will proxy the same ability check, but against our user model’s permissions according to the Spatie permissions package.

### Register the Custom Access Token Model

Next, we need to tell Sanctum to override the default model for our Custom token.

```php
<?php

namespace App\Providers;

use App\Models\CustomToken;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;
    
    class AppServiceProvider extends ServiceProvider
    {
        public function register(): void
        {
            //
        }
    
        public function boot(): void
        {
            Sanctum::usePersonalAccessTokenModel(CustomToken::class);
        }
    }
```

Example Usage
-------------

Here is a basic setup for seeing the same rule set in action across web guard and sanctum.

### Routes

Our `web.php` routes file could look like this:

```php
Route::get('/protected', function () {
    Route::get('/protected', function () {
        return 'This is protected';
    })->middleware('auth', 'can:view-protected');
```

And your `api.php` route looks like this:

```php
Route::get('/protected', function () {
    return 'This is protected by sanctum';
})->middleware(['auth:sanctum', 'can:view-protected'])
        ->name('api.protected');
```

If you do not have a `/routes/api.php` file yet, first create a `/routes/api.php` file. Then, in your `bootstrap/app.php` file, you can add it here:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    api: __DIR__.'/../routes/api.php', // 👈 Add this
    health: '/up',
)
```

### Tests

Next, we can try out our new setup using some tests below.

```php
<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\get;
    
    beforeEach(function () {
        $this->role = Role::create(['name' => 'admin']);
        $this->permission = Permission::create(['name' => 'view-protected']);
        $this->role->givePermissionTo($this->permission);
        $this->route = route('api.protected');
    });
    
    test('user can access protected route', function () {
        $user = User::factory()
            ->create()
            ->assignRole($this->role);
    
        $this->actingAs($user)
            ->get('/protected')
            ->assertStatus(200);
    });
    
    test('user cannot access protected route', function () {
        $user = User::factory()->create();
        $this->actingAs($user)
            ->get('/protected')
            ->assertStatus(403);
    });
    
    test('Spatie permissions are proxied to token abilities', function () {
    
        $token = User::factory()
            ->create()
            ->givePermissionTo('view-protected')
            ->createToken('test-token')
            ->plainTextToken;
    
        get(route('api.protected'), ['Authorization' => 'Bearer '.$token])
            ->assertOk(200);
    });
```

In the tests above, we’re verifying that a user can access the same respective abilities in both the API as well as the web guard (our web app).

Trade-offs & Advanced Usage
---------------------------

In a tradition as old as time, when figuring out if this pattern makes sense for your application, the answer is always _it depends._ I find this approach works brilliantly if I have a both a user-facing dashboard, as well as a public API, and I want to create a simple token that allows users to do exactly what they can do in the admin. However, there are trade offs. In our simpler approach, we don’t account for allowing users to create more granular-permission tokens, which violates the [Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege#:~:text=If%20execution%20picks%20up%20after,in%20defence%20and%20intelligence%20agencies.).

If a user wants to be more granular with token scopes, we can alter our approach to allow a layered permission check. In the class below, this would allow the `User` to create either tokens with specific permissions, or defer to the inherited permissions of the user.

```php
<?php

    namespace App\Models;
    
    use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
    
    class CustomToken extends SanctumPersonalAccessToken
    {
        public $table = 'personal_access_tokens';
    
        public function can($ability)
        {
            // if the user can't do it, our token can't either.
            if(!$this->tokenable->can($ability)) {
                return false;
            }
    
            // no wildcards. sorry Charlie.
            $abilities = collect($this->abilities)->filter(function($ability) {
                return $ability !== '*';
            })->toArray();
    
            // we have explicit permissions passed to `createAccessToken`
            if(count($abilities) > 0) {
                return $this->canDb($abilities);
            }
    
            return true;
    
        }
    
        protected function canDb($ability): bool
        {
            return array_key_exists($ability, array_flip($this->abilities));
        }
}
```

* * *

### Video Tutorial

If you are a visual learner, I recorded this video just for you :)

[https://www.youtube.com/watch?v=YX\_X-kYLN8c](https://www.youtube.com/watch?v=YX_X-kYLN8c)