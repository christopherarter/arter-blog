---
title: "How to Setup TailwindCSS in Laravel: A Quick Tutorial Guide"
slug: "how-to-setup-tailwindcss-in-laravel-a-quick-tutorial-guide"
subtitle: ""
author: "Chris Arter"
publishDate: "2021-01-01T16:02:32.493Z"
dateUpdated: "2021-01-01T16:03:12.785Z"
---

### Ready to ride the tailwind? Let's do it!

This guide will show you how to setup [TailwindCSS](https://tailwindcss.com) in your Laravel project. It assumes you are using Laravel 8 and Laravel mix to bundle your front-end assets.

#### Step 1: Install Tailwind via NPM

In your Laravel project, run the following command:

    npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
    

#### Step 2: Initialize Tailwind

Next, you'll want to initialize tailwind. This step will create a `tailwind.config.js` file in your project.

    npx tailwindcss init
    

Check out TailwindCSS documentation for available configurations [here](https://tailwindcss.com/docs/configuration).

#### Step 3: Set up Laravel Mix

This step is purely my opinion, but I prefer to use SCSS instead of CSS in my `/resources` folder. So, for this step we'll make sure we have a file at `/resources/scss/app.scss`

Assuming the above, this is how we want to set up our `webpack.mix.js file`

    const mix = require('laravel-mix');
    const tailwindcss = require('tailwindcss')
    
    mix.js('resources/js/app.js', 'public/js')
        .sass('resources/scss/app.scss', 'public/css')
        .options({
            processCssUrls: false,
            postCss: [
              tailwindcss('./tailwind.config.js'),
            ]
        });
    

#### Step 4: Import TailwindCSS in your SCSS file

Next, lets make sure your `/resources/scss/app.scss` includes this at the top:

    // /resources/scss/app.scss
    @import "tailwindcss/base";
    @import "tailwindcss/components";
    @import "tailwindcss/utilities";
    

#### Step 5: Profit

Alright, let's run `npm run dev` and we should see a successful result like this:

![Screen Shot 2021-01-01 at 10.08.58 AM.png](/images/1737473617712-Yz4tR2h4a.png)

Note: Make sure you're already outputting the bundled assets in your blade template somewhere:

    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    

#### Ride the Tailwind 😎

This is a really quick primer on setting up Tailwind that should get you up and running. Of course, for more information visit the [TailwindCSS Documentation](https://tailwindcss.com/), and for inspiration, check out tons of free components at [Tailwind Components](https://tailwindcomponents.com/).

Follow me on twitter [@ChrisArter](https://twitter.com/chrisarter) for more tips!