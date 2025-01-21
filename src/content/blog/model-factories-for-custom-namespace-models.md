---
title: "Model Factories for Custom Namespace Models"
slug: "model-factories-for-custom-namespace-models"
subtitle: "A quick tip on how to allow Laravel to detect custom namespace models"
author: "Chris Arter"
publishDate: "2023-05-02T12:46:58.598Z"
dateUpdated: ""
---

If you like to follow certain patterns, such as DDD, you may find models in different directories than the typical App\\Models namespace in your Laravel app.

Laravel can work with this no problem, except ...for Factories. These normally rely on convention to find your model, but in the case of using custom namespaces outside of the App\\Models namespace, they won't be able to find your model for a given Factory.

### Step 1: Set Factory Model Property

Let's say we have this structure below:

    app/
      Content/
        Models/
          Post.php
    

This would make our namespace for our `Post` model `App\Content\Models\Post`.

Next, we'll create our factory:

    php artisan make:factory PostFactory
    

We can set the model to be used by this factory by setting the $model property:

    class PostFactory extends Factory {
       protected $model = \App\Content\Models\Post::class;
    // other code
    }
    

### Step 2: Service Provider

The previous step is not enough on its own, we will also want to tell Laravel how to resolve the factories so that it can find our factories all over the app (in PHPUnit setup() method, database seeding, etc).

Update your `AppProvider` in `app/Providers/AppServiceProvider.php`

    use Illuminate\Database\Eloquent\Factories\Factory;
    
    class AppServiceProvider extends ServiceProvider
    {
      public function boot(): void {
         // ...  
        Factory::guessFactoryNamesUsing(function(string $modelName) {
          return 'Database\\Factories\\' . class_basename($modelName) . 'Factory';
        });
    }
    

(Tip provided by [@ejunker](https://twitter.com/ejunker/status/1306007589940068352), thank you!)

This will tell Laravel where the factory name is for our custom namespaced models. It's important that we follow the convention its looking for. So in our example, our `Post` model would have a factory named `PostFactory`. If you have other models like `Comment`, then the factory would need to be called `CommentFactory`.

### Conclusion

Hope this little tip helps. It's a slight annoyance that I think would make a good candidate for a PR to introduce a more elegant way to define the factory for a model outside the `App\Models` namespace, but this workaround will get you going for now 😊