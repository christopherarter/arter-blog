---
title: "Semantic Versioning Cheat Sheet"
slug: "semantic-versioning-cheat-sheet"
subtitle: "A quick guide on Semantic Versioning and why you should care."
author: "Chris Arter"
publishDate: "2024-01-05T14:48:31.175Z"
dateUpdated: ""
---

So here's a cheat sheet for understanding semantic versioning. I've used this off an on throughout my career, especially at Bankrate. Granted, this was always done automatically using something like [semantic-release](https://www.npmjs.com/package/semantic-release), but having an understanding of how semantic versioning works will let you know what tools like this are doing, and when they muck things up (because, they do).

### Why?

Semantic versioning adds predictability, and predictability is the secret ingredient for everything good in developer experience. Even if a tool sucks, if it's predictable, it's much easier to work with. Semantic versioning makes changes to your software more predictable, hence, suck less :)

Ok enough chit chat let's do this.

### Format

So the format is pretty simple:

*   **MAJOR.MINOR.PATCH**, e.g., 1.4.2

This is the convention for seeing the state of a software's version at a glance. If you've got 1.4.87 then they've been putting out some fires and hot fixes for sure (this assumes 87 patch releases).

### When to Update:

1.  **MAJOR version (1.x.x)**
    
    *   **When:** Make incompatible API changes.
        
    *   **Rule:** Reset MINOR and PATCH to 0 when MAJOR increments.
        
    *   **Example:** 2.0.0
        
2.  **MINOR version (x.1.x)**
    
    *   **When:** Add functionality in a backward-compatible manner.
        
    *   **Rule:** Increment MINOR by 1, reset PATCH to 0.
        
    *   **Example:** 1.5.0 (from 1.4.2)
        
3.  **PATCH version (x.x.1)**
    
    *   **When:** Make backward-compatible bug fixes.
        
    *   **Rule:** Increment PATCH by 1.
        
    *   **Example:** 1.4.3 (from 1.4.2)
        

### Let's put a label on it:

*   **Pre-release versions:** Append a hyphen and a series of dot-separated identifiers immediately following the PATCH version.
    
    *   **Example:** 1.0.0-alpha, 1.0.0-alpha.1, 1.0.0-0.3.7, 1.0.0-x.7.z.92

### Principles

So these are the principles of semantic versioning, and basically the "why" behind why this practice is used.

*   **Backward Compatibility:** Changes should not break the API in a way that would force users to change their own code unless it's a MAJOR version change.
    
*   **Clarity and Predictability:** Version numbers should convey meaningful information about the changes in the release.
    

### Some more tips

*   Document changes meticulously in a changelog. There's a bunch of AI tools that can generate change logs now so it's not such a chore anymore, but nonetheless change logs are a great way to not piss off (as many) developers.
    
*   Make sure the change logs make breaking changes **clear**. Like, very clear about what will be broken.
    
*   Let a robot do all this stuff and use a semantic versioning package.
    

In 2024 and beyond, I wouldn't recommend managing the semantic versioning manually once a project begins to grow, but it's good to have a conceptual understanding of the format and ideas behind it.

Now, go build some stuff!

#### If you're really into this nerd stuff you can read more here:

*   [Semantic Versioning Specification](https://semver.org/)