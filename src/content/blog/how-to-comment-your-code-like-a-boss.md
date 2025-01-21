---
title: "How to Comment Your Code Like a Boss"
slug: "how-to-comment-your-code-like-a-boss"
subtitle: ""
author: "Chris Arter"
publishDate: "2020-11-30T16:28:33.903Z"
dateUpdated: "2020-11-30T17:25:11.100Z"
---

Comments are like garlic.

They can push a dish over the top. Or, they can relegate it to the polite pile of leftovers that your guests appreciate but didn't enjoy.

Comments in your code are much the same. Good, clear, and necessary comments can help keep an otherwise convoluted narrative of code become a clear, easy-to-follow story.

The two main ideas that have helped me when deciding if a section of code needs comments, or if I should leave it bare are these:

### 💡 Code should explain _what_ is happening.

A true gem from Uncle Bob's _Clean Code_ is the chapter on naming. Explicit and clear naming will help make your code be clear and easy to follow.

Instead of this:

```js
// get the length of an array
const gl = a => a.length
```

We write this:

```js
const getArrayLength = a => a.length
```

This allows us to write code that is expressive. The code itself tells you what is happening. In the simple example above, the name of the function tells you what it does. There is no need to parrot this in a comment above. Each time you write a comment, you add to the mental overhead of trying to parse not only the code, but the comments as well. This is why comments should be limited & meaningful.

### 💡 Comments should explain _why_.

Let's say we have a user base that is split between two databases. A client or product has users from an old system, a new system, and our application needs to manage both while we transition the code base to a new platform.

```js
import oldsdk from 'old-sdk';
import newsdk from 'new-sdk';

const getUserByEmail = async email => {

    // we switched identity providers
    // and not all users are migrated yet.
    const oldUserData = await oldsdk.getUserByEmail(email);
    const newUserData = await newsdk.getUserByEmail(email);
    return newUserData || oldUserData;
}
```

In this example, we are fetching a user from some API using a new SDK, and an old SDK. Stuff like this happens _all the time_. For someone reading this code, while the variable names are descriptive, we don't know _why_ this is happening. The comments in this code explains the _purpose_ of this code. The _what_ is still clear.

#### Conclusion

Like many things, this is not a hard and fast rule. In fact, it's not even a rule, but more like a tool. It's a generalized guidepost that has been helpful for me in my career as a barometer for writing good comments. There are plenty of situations where you would want or need to approach things differently, but this tip can be a great starting point when getting a feel for writing comments.

Happy coding!