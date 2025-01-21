---
title: "Laravel 9 Crash Course Part 0: Setting up Laravel Sail"
slug: "laravel-9-crash-course-part-0-setting-up-laravel-sail"
subtitle: ""
author: "Chris Arter"
publishDate: "2022-03-23T12:26:53.000Z"
dateUpdated: "2022-04-02T12:29:22.349Z"
---

### Step 0: Docker Desktop

If you don't have Docker desktop installed, go ahead and download & install from https://www.docker.com/products/docker-desktop/

### Step 1: Install Laravel

Docker installed? Awesome, we're ready to go.

If you're on a mac, you can use this command to start a fresh project.

    curl -s "https://laravel.build/crash-course" | bash
    

There's quite a few ways to install Laravel based on your preferred approach and OS. To install on Windows, check the [Windows installation docs.](https://laravel.com/docs/9.x#getting-started-on-windows)

### Step 2: Start Sail

Next we'll run `cd crash-course && ./vendor/bin/sail up`

That's it, we're ready to start!

If you'd like to follow along with a manual installation of Sail, check out my corresponding video: