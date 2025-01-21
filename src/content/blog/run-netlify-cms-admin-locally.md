---
title: "Run Netlify CMS Admin Locally"
slug: "run-netlify-cms-admin-locally"
subtitle: "A quick breakdown of how to run your Netlify CMS admin on your local machine."
author: "Chris Arter"
publishDate: "2022-12-29T19:11:12.347Z"
dateUpdated: "2022-12-29T19:14:31.784Z"
---

Let's cover how to run the Netlify CMS on your local machine. This write-up assumes you've already Netlify CMS in your project. After setup, you should have an admin folder containing an `index.html` and `config.yml` file. If not, go ahead and add those. See [the documentation](https://www.netlifycms.org/docs/add-to-your-site/) for more info.

The `config.yml` file is used to set up the fields and properties needed for the dashboard.

The `/admin` route is the public path that allows access to the dashboard on your website, but it can only be accessed when the site is live.

Here's an example of the folder structure:

    /admin
       config.yml
       index.html
    

To access the Netlify CMS admin on your local machine, follow these steps:

1.  Add `local_backend: true` in the `config.yml` file in the admin folder.
    
2.  Run `npx netlify-cms-proxy-server` from the root directory of your repository. The proxy server will run on a different port, typically port `8081`.
    
3.  Now, go to whatever route is running your website locally and go to `/admin`. So, if your app runs on port `3000` for example, you can access your admin at `localhost:3000/admin`
    

Happy blogging!