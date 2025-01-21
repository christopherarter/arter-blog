---
title: "I'm officially a Laravel core (docs) contributor! 🎉"
slug: "im-officially-a-laravel-core-docs-contributor"
subtitle: ""
author: "Chris Arter"
publishDate: "2020-01-30T14:15:32.000Z"
dateUpdated: ""
---

Currently, my colleagues and I are troubleshooting some deployment issues with our Laravel Horizon queue. On our development server, the deploy process works beautifully, and subsiquent jobs are firing correctly when the jobs are placed into the queue.

On staging & production, however, we are seeing that the jobs are not running at all. We narrowed it down to being an issue potentially in our deploy script or the daemon running the Horizon service.

During the debugging process, I thought to myself, "There must be a CLI command to check if Horizon is running in the console." Sure enough, there was. Eight months prior, an addition to Horizon was added to allow the command: `php artisan horizon:status` which will display the status of the currently running Horizon process.

After discovering this, this command was incredibly useful for debugging our issue, yet was completely undocumented in Laravel's docs. I've heard through the grapevine and other dev watering holes that contributing to Laravel core (or its documentation, in my case) has become increasingly difficult. Probably for good reason, but it seemed getting a PR merged was harder than years past.

On a whim, I submitted a PR to add just a small blurb to the documentation about this status command, so that others in my situation would find it faster, without having to dig through source code or github issues like I had.

    You may check the current status of the Horizon process using the horizon:status Artisan command:
    
    ```bash
    php artisan horizon:status
    ```
    

☝️ That's it. That's my claim to fame. A small blurb about one command. But, it feels great to contribute the project and add my little piece to it, however small.

Happy trails!