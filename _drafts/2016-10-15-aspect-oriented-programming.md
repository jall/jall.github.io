---
layout: post
title: Aspect oriented programming
---

Recently, I was adding logging to a slew of business logic classes in the project
I'm working on, and it began to irritate me that I essentially had to inject the
logger into every class containing non-trivial functionality. It felt like it was
polluting the codebase by violating single responsibility; every class now had to
deal with the job it was made to do, AND handle the logging of it.

My first thought was to extract the logging part into its own class which could
wrap the business logic class and preserve single responsibility that way. However,
this would involve creating two classes for everything that needs logging (your
*BusinessLogicer* and then a *BusinessLogicerLogger* on top) which is both cluttered
and makes it very likely that someone else on the project will end up using the
non-logging class instead of the logging wrapper.

So I wandered over to Google to see how other people handled this, or if I was
simply overcomplicating things. I ended up stumbling across aspect oriented
programming, and a php framework called [Go!](http://go.aopphp.com/blog/2013/02/11/aspect-oriented-framework-for-php/).

## Aspect oriented programming

<!-- Brief overview of cross cutting concerns -->
<!-- Link to Go! AOP page with logging example -->

## Implementation

<!-- Code snippets of how it's used in project -->
<!-- Overview of different classes needed to set up -->
<!-- Why annotations; easy to add, right balance of configurable but generic  -->

### Pros

<!-- Classes are much closer to single responsibility -->
<!-- Trivially easy to add logging to any public/protected method in codebase without refactoring -->

### Cons

<!-- Adds cached generated code which is actually run -->
<!-- General annotations dislike - maybe extensible by YAML? -->
<!-- Requires additional test to check AOP logging is taking place -->
* Adds abut 20ms to request time (according to docs, I haven't benchmarked this)

I ended up extracting my AOP logging functionality into its own small
[Symfony bundle](https://github.com/jall/AopMonologBundle), which is
now available for anyone to play about with. I'd be interested in feedback
or any issues with this approach that I've missed.
