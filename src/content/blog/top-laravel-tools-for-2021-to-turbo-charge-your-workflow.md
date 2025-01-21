---
title: "Top Laravel Tools for 2021 to Turbo-charge Your Workflow"
slug: "top-laravel-tools-for-2021-to-turbo-charge-your-workflow"
subtitle: ""
author: "Chris Arter"
publishDate: "2021-01-06T17:32:27.413Z"
dateUpdated: "2021-01-06T17:59:07.154Z"
---

Let's talk tooling! One of the benchmarks of a great framework is the ecosystem & tooling. I may be biased, but I think Laravel has some of the best tooling around. These are _my_ top tooling choices for 2021. Let's gooo.

### Tinkerwell

![Tinkerwell screen shot](/images/1737473617711-z-txhuM63.png)

Tinkerwell may be my new favorite tool. What is it? It's a "magical code editor" as described on the site. Basically, it's a code editor that allows you to execute code in any PHP runtime context. It's a scratch pad to try real eloquent queries without setting up a test or test controller.

My typical workflow for this is:

*   Have a feature idea, or query I'm trying to write
*   Write the queries / feature in Tinkerwell on my local dev DB data.
*   Get feature working in this scratch pad
*   Refactor and implement in the actual codebase with tests.

It may seem like an extra step, but the freedom and flexibility of having a place to try out ideas has speed up my development considerably, especially when writing new features.

🔗 [Tinkerwell](https://tinkerwell.app/)

### Clockwork

![Laravel Clockwork image](/images/1737473618000-qIEgnANJZ.png)

Ya'll. Let's talk about Clockwork. Everyone is sleeping on this tool. It's absolutely _fantastic_. It's a debug tool that also has a browser extension in the inspector panel.

For example, this is an actual waterfall-esque view from the performance tab.

![Screenshot of Clockwork performance waterfall](/images/1737473618349-4JrCwa2dk.png)

It's great, but what really wowed me was the next view, where I'm able to see not only the DB queries, but the line number of the eloquent call that created them.

![Screenshot of Clockwork queries](/images/1737473618863-KN91fBAWe.png)

From this panel above, I'm able to see that the eloquent call that created this query is in my `ReviewsController` on line `114`. This is also the tool I used to discover that despite using Spatie's response cache package, I was still costing a DB call from the custom route binding I registered in the Route Service Provider. But, not to worry, I wrote a [workaround](https://arter.dev/how-to-avoid-all-database-calls-using-spatie-response-cache-package) for that issue too.

So far, this has helped me:

*   Find slow queries
*   Find N+1
*   Optimize queries
*   Find caching opportunities

🔗 [Clockwork](https://underground.works/clockwork/)

### Laravel Extensions Pack for VS Code

![Laravel Extensions Pack](/images/1737473619091-foKoHrzpH.png)

This is basically the NBA All-star team of VS Code extensions in the Laravel ecosystem. Installing this pack gives you a great foundation of tools for VS Code to maximize your productivity. Some of my personal favorites are the GoToView & GoToController. They're small quality of life improvements that really add up to a great experience.

The pack includes:

*   [Laravel Blade Snippets](https://github.com/onecentlin/laravel-blade-snippets-vscode)
*   [Laravel Snippets](https://github.com/onecentlin/laravel5-snippets-vscode)
*   [Laravel Artisan VS Code](https://github.com/TheColorRed/vscode-laravel-artisan)
*   [Laravel GoToView](https://github.com/codingyu/laravel-goto-view)
*   [Laravel GoToController](https://github.com/stef-k/laravel-goto-controller)
*   [Laravel Extra Intellisense](https://github.com/amir9480/vscode-laravel-extra-intellisense)
*   [DotEnv](https://github.com/mikestead/vscode-dotenv)
*   [EditorConfig](https://github.com/editorconfig/editorconfig-vscode)
*   [PHP Debug](https://github.com/xdebug/vscode-php-debug)
*   [PHP Intellisense](https://github.com/bmewburn/vscode-intelephense)

🔗 [Laravel Extensions Pack](https://github.com/onecentlin/laravel-extension-pack-vscode)

Are there any tools that you've used lately that I should try? Drop them in the comments!