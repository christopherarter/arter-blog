---
title: "Demystifying Gates in Laravel"
slug: "demystifying-gates-in-laravel"
subtitle: "If you find the concept of \"gates\" in Laravel a bit confusing, don't worry. You're not alone."
author: "Chris Arter"
publishDate: "2023-01-05T15:00:42.020Z"
dateUpdated: ""
---

I found gates a bit confusing for quite some time. I just ignored them for the first couple of years developing Laravel applications. I was confused by the naming and wasn't sure exactly what they were.

Let me get this out of the way:

Gates are permissions.
----------------------

That should clarify a lot of the confusion. They're simply portable logic you can check for across your app. For example, you can define a gate in a service provider. This example is from the docs:

        Gate::define('update-post', function (User $user, Post $post) {
            return $user->id === $post->user_id;
        });
    

Now, we can check for this in several different places in our app. For example, our controller (another example from the docs):

    class PostController extends Controller
    {
        public function update(Request $request, Post $post)
        {
            if (! Gate::allows('update-post', $post)) {
                abort(403);
            }
    
            // Update the post...
        }
    }
    

You can also reference it in things like a blade file:

    @can('update-post')
    <a href="{{ route('posts.edit', ['post' => $post]) }}">Update</a>
    @endcan
    

Use Policies Instead
--------------------

Now that you get an idea of what gates are, my strong suggestion is to use [policies](https://laravel.com/docs/9.x/authorization#creating-policies) instead.

Policies are classes with related methods around a particular model or idea. When creating a policy for a model, you can pass the `--model=Post` flag which will create a policy with authorization logic around each CRUD (create, read, update, delete) operation on your model.

Here's an example of a model policy class:

    class PostPolicy {
    
      public function view(User $user, Post $post)
      {
         // ...
      }
    
      public function create(User $user)
      {
         // ...
      }
    
      public function update(User $user, Post $post)
      {
         // ...
      }
    
      public function delete(User $user, Post $post)
      {
         // ...
      }
    }
    

You don't need to manually write various gates in your service provider. You can simply create a model policy, and Laravel provides an easy API throughout the app to use this policy.

This is an example from the docs of what a check looks like in a policy:

    class PostPolicy
    {
        // ...
    
        public function update(User $user, Post $post)
        {
            return $user->id === $post->user_id;
        }
    }
    

Now we can easily check against this logic in places like our routes file:

    Route::get('/posts/{post}/edit', [PostsController::class, 'update'])->middleware('can:update,post');
    

The cool part about the snippet above is `->middleware('can:update,post');` method.

In a single line of code, it creates a middleware that will automatically return an `403` if it fails the `update` method in our policy above.

So that's all gates are! Permissions. Nothing scary. But these days I exclusively use Policy classes, as well as Spatie's [Laravel Permissions](https://spatie.be/docs/laravel-permission/v5/introduction) package.

Happy coding 🥳