---
title: "How to Upgrade to PHP 8.2 on MacOS with Homebrew"
slug: "how-to-upgrade-to-php-82-on-macos-with-homebrew"
subtitle: "A no-frills guide"
author: "Chris Arter"
publishDate: "2022-12-08T15:23:26.466Z"
dateUpdated: ""
---

Here is a simple guide to installing or upgrading to PHP 8.2 on MacOS with Homebrew.

### 1\. Update Homebrew

It's good to make sure Homebrew itself is up to date before we install anything else. To do that we'll run:

```bash
brew update
```

### 2\. Install PHP 8.2

Next, we'll install PHP.

```bash
brew tap shivammathur/php
brew install shivammathur/php/php@8.2
```

### 3\. Switch to the new version

Lastly, we'll want to tell our machine which version to use:

```bash
brew link --overwrite --force php@8.2
```

The repo for this install is available here: https://github.com/shivammathur/homebrew-php

### 4\. Verify

To verify our install, open a new terminal window and run:

```bash
php -v
```

That should show you running `php 8.2` 🥳