---
title: "How To Install Vue 3 in Laravel 8 From Scratch"
slug: "how-to-install-vue-3-in-laravel-8-from-scratch"
subtitle: "A step-by-step guide to installing, mounting, and displaying Vue 3 components in a base Laravel 8 install."
author: "Chris Arter"
publishDate: "2021-04-21T17:58:29.847Z"
dateUpdated: "2021-04-22T13:07:43.370Z"
---

If you have a vanilla Laravel install and want to add some spicy Vue 3 components, then I'm going to show you exactly how to install Vue 3 in your Laravel 8 project.

In this tutorial I will be detailing:

*   How to install Vue 3
*   How to register single-file-components
*   How to display components inside your blade files

#### Prerequisites

This tutorial assumes you are using:

*   Laravel 8
*   Laravel Mix 6
*   Node version >=12.14

### Step 1: Install Vue & Dependencies

First, we'll want to install Vue 3 and our dev dependencies:

```bash
npm install --save vue@next && npm install --save-dev vue-loader@next
```

### Step 2: Prepare Mix for Vue

Let's go to our `webpack.mix.js` file and add a `.vue()` method chain. Our mix file should now look something like this:

```js
mix.js('resources/js/app.js', 'public/js')
    .vue()
    .postCss('resources/css/app.css', 'public/css', [
        //
    ]);
```

_(Note: If you get an error, remember to check if your version of Laravel Mix is 6 and up.)_

### Step 3: Create your Vue 3 component

Next, let's go ahead and create our Vue 3 component. In the spirit of adventure, let's use the new composition API. Create a file `/resources/js/components/HelloWorld.vue` as so:

```vue
<template>
    <h1>{{ greeting }}</h1>
</template>
<script>
export default {
    setup: () => ({
        greeting: 'Hello World from Vue 3!'
    })
}
</script>
```

### Step 3: Import Vue to the Laravel javascript file.

Assuming your structure is the same from a vanilla install, we will be mounting Vue in our `resources/app.js` file. This part will look a bit different if you've seen Vue 2 initialized in Laravel before.

First, we are not going to import _Vue_, we are going to import a named export from Vue 3 called `createApp`.

```js
import { createApp } from 'vue'
```

Next, let's import our `HelloWorld` component and create the Vue app.

```js
import HelloWorld from './components/HelloWorld.vue';

const app = createApp({});
```

Great, we've now created a Vue app instance! But, we haven't registered our component or mounted Vue. To do that, we will add:

```js
// registers our HelloWorld component globally
app.component('hello-world', HelloWorld);

// mount the app to the DOM
app.mount('#app');
```

Finally, our `app.js` file will look something like this:

```js
import { createApp } from 'vue'
import HelloWorld from './components/HelloWorld.vue';

const app = createApp({});
app.component('hello-world', HelloWorld)
    .mount('#app');

require('./bootstrap');
```

### Step 4: Prepare Blade for Vue

Wherever you store your opening and closing `body` tags, that's where we want to work next. Let's just use a vanilla install as an example, so we'll work in the `resources/views/welcome.blade.php` file.

First, we want to add a div inside the `body` tag:

```php
<body class="antialiased">
    <div id="app">
```

Next, let's make sure we close it. However, we want to output the compiled JS to the page, so we'll sneak that in between these two. It's important that our script tag is _outside_ our `#app` div:

```php
{{-- closing div for #app --}}
</div>

{{-- output the compiled JS --}}
<script src="{{ asset('js/app.js') }}"></script>

</body>
```

So, the structure should be like this:

```php
<body class="antialiased">
    <div id="app">
       {{-- stuff in here --}}
    </div>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
```

### Step 5: Compile Javascript Assets

Lastly, we'll run

```bash
npm run watch
```

This may notify you that it is installing other dependencies to compile Vue components and will prompt you to run the command again. It may look something like this:

```
Additional dependencies must be installed. This will only take a moment.

        Running: npm install @vue/compiler-sfc --save-dev --legacy-peer-deps

        Finished. Please run Mix again.
```

If you need to, run Mix again with `npm run watch` and you should see a successful compile.

### Step 6: Use your Vue Component In Blade 🚀

Lastly, we can now use our component in our Blade files. In our`resources/views/welcome.blade.php`, we can test the component like this:

```php
<div id="app">
   <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center py-4 sm:pt-0">
       <hello-world/>
   </div>
</div>
```

Run `php artisan serve` and check `http://localhost:8000` and you should see..

![Screen Shot 2021-04-21 at 1.47.48 PM.png](/images/1737473617711-RjFlZ3fbE.png)

That's it. You're now able to create single-file components and mix them into your blade files at will. Be sure to check the [Vue 3 docs](https://v3.vuejs.org/guide/component-basics.html#passing-data-to-child-components-with-props) to learn more about Components in Vue 3. If you'd like to learn more about how to initialize the application, check [that section](https://v3.vuejs.org/guide/instance.html#creating-an-application-instance) in the Vue 3 docs as well.

Follow me on Twitter [@ChrisArter](https://twitter.com/ChrisArter) for more Laravel & Vue ✌️