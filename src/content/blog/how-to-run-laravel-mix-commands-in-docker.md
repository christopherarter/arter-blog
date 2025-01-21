---
title: "How to run Laravel Mix commands in Docker"
slug: "how-to-run-laravel-mix-commands-in-docker"
subtitle: "Goodbye .nvmrc files"
author: "Chris Arter"
publishDate: "2021-11-24T14:07:41.568Z"
dateUpdated: ""
---

A common problem I see in different organizations is standardizing the local environment for Laravel Mix. One developer may build with Node 16, another Node 14, and there are commonly build errors that show up on one machine, but not the other.

We've _all_ heard this one:

> It works on my machine 🤷‍♂️

While I've certainly seen teams take advantage of using Docker for the php & nginx services, as well as local database and redis, I've recently started using a technique to standardize the Laravel Mix environment.

What advantages does this give you? All the advantages any Dockerized enviornment gives you:

*   **Consistency** - Any developer on your team can build the mix assets exactly the same way the rest of the team.
*   **Portability** - Not only can this be run by your local machine, but it can also be run by your CI runner, letting you deploy the exact same code that you build locally.

### Step 1: Create your docker-compose file

_Note: Before we start, make sure you have [Docker](https://www.docker.com/) installed on your local machine._

If you don't have a `docker-compose.yml` file in your project already, let's go ahead and add one. This file should be in the root directory of your Laravel application.

Next, we'll add the contents of the file:

    version: '3.8'
    
    services:
      npm:
        image: node:current-alpine
        environment:
          - NODE_OPTIONS=--openssl-legacy-provider
        volumes:
          - .:/var/www/html
        entrypoint: ['npm']
    

Let's wok through some of these lines.

    image: node:current-alpine
    

This line is where we declare what version of Node we're using to build our Laravel Mix assets.

        environment:
          - NODE_OPTIONS=--openssl-legacy-provider
    

We're also passing some environment variables to set our node options. This is to get around [this bug](https://github.com/webpack/webpack/issues/14532#issuecomment-947012063) I found while implementing this myself.

        volumes:
          - .:/var/www/html
    

Volumes are two-way links between files on your local machine and inside the container. This is just designating our local folder linked to the corresponding folder in the container.

    entrypoint: ['npm']
    

This is what will be run before our command we pass in the next step.

### Step 2: Build your assets!

Now for the fun part: build our mix assets for development on our local machine. Here is the command to run a dev build:

    docker-compose run --rm npm run dev
    

Let's take a look at what this command is actually doing, so you can better understand how docker-compose is running this build task. We'll start with the first part of the command:

    docker-compose run --rm npm
    

This is instructing docker-compose to run a specific service in our `docker-compose.yml` file (specifically, our `npm` service we created above).

Next, the `--rm` flag will let us run the container for the duration of the given command, then remove it when it's done.

The second part of our command is what is actually being passed to the container

    run dev
    

When we put those together, we get:

    docker-compose run --rm npm run dev
    

To run the mix watch command, we would run a similar command above, but just change to:

    docker-compose run --rm npm run watch
    

Because we used the `--rm` flag, once you shut down the watch process, the container will also be removed.

### Conclusion

As with many things in tech, there are trade offs. This process is a bit slower to run, but I personally find myself running mix in watch mode, so once the container spins up the differences in speed during recurring builds are not as noticeable.

This post was inspired by [The Docker Tutorial](https://laracasts.com/series/the-docker-tutorial) created by [Andrew Schmelyun](https://twitter.com/aschmelyun).