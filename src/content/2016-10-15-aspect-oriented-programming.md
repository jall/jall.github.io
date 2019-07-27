---
layout: page
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
_BusinessLogicer_ and then a _BusinessLogicerLogger_ on top) which is both cluttered
and makes it very likely that someone else on the project will end up using the
non-logging class instead of the logging wrapper.

So I wandered over to Google to see how other people handled this, or if I was
simply overcomplicating things. I ended up stumbling across an interesting [blog
post](http://go.aopphp.com/blog/2013/07/21/implementing-logging-aspect-with-doctrine-annotations/)
about aspect oriented programming (AOP), and a php framework for it called [Go! AOP](https://github.com/goaop/framework).

## What's aspect oriented programming?

To quote [wikipedia](https://en.wikipedia.org/wiki/Aspect-oriented_programming):

> Aspect-oriented programming (AOP) is a programming paradigm that aims to increase modularity by allowing the separation of cross-cutting concerns.

In more concrete terms, it allows you to extract any bits of functionality used
widely across your system ('_cross-cutting concerns_') like logging or caching,
and separate them into their own modules.

It allows you to mitigate some of the [common problems that arise with standard OOP](http://i.imgur.com/Q0vFcHd.png), like injecting the logger in every
class! This can make your code much DRYer and modular, as the responsibility for
logging now only lies with the logging code and some configuration to point it to
the areas you want logged.

## How do you use it?

Here's an example of adding a log to the login method of a controller:

```php
<?php

// ...

/**
 * @Log(
 *      message = "User {% raw %}{{ user.name }}{% endraw %} has logged in",
 *      level = "info",
 *      channel = "user",
 *      context = {
 *          "user.name": "input['user'].getUserName()",
 *      },
 * )
 */
public function loginAction(User $user)
{
    // Login logic goes here!
}
```

Now, every time this method is called a log is generated without having to touch
the logger yourself!

In the implementation I wrote, any public or protected method annotated with the
`@Log` or `@LogException` annotation automatically triggers the logger whenever
the method is called or throws an exception (respectively).

You can create much more complex or targeted ways for Go! to match where to
trigger functionality, from matching access of a single variable in a specific
class, to matching all public method calls in any class being scanned.

I chose annotations because they hit the sweet spot of being configurable (you
can set variables per annotation) but generic enough to be reusable across the
project. In this case the annotations allow you to set the message to be logged,
the channel & level to log it to, and any context[^fn-log-context] you want saved with the message.

When the function is triggered in a matching way, my logging code is called with information on the method invocation (including the annotation & its configuration), which then actually writes the log (using [Monolog](https://github.com/Seldaek/monolog) in this case).

## Thoughts on AOP approach to logging

### Pros

- Classes are much closer to single responsibility.
- Trivially easy to add logging to any public/protected method in codebase without refactoring.

### Cons

- Requires some additional tests to check logging is taking place. [^fn-logging-tests]
- Adds ~20ms to request time. [^fn-request-time]
- It uses annotations to tag the places to be logged. Many people [dislike annotations](https://r.je/php-annotations-are-an-abomination.html);
  this could be fixed by allowing yaml/xml configuration as an alternative.
- Generates code which includes the interleaved AOP functionality & the original class. [^fn-generated-code] [^fn-generated-code-ok]

## Code

I ended up extracting my AOP logging functionality into its own small
[Symfony bundle](https://github.com/jall/AopMonologBundle), which is
now available for anyone to play about with. I'd be interested in feedback
or any issues with this approach that I've missed here.

### Footnotes

[^fn-log-context]: In my implementation I use the Symfony expression language to process/calculate any variables from the input or output of the function.
[^fn-request-time]: According to the Go! documentation, I haven't benchmarked this. Wasn't a noticeable change on my project.
[^fn-generated-code]: Go! works by scanning your code for any bits of code matching one of the aspects you've defined (in this case anything annotated with `@Log` or `@LogException`), then generating a new class which wraps the matching code in a call to the logger.
[^fn-generated-code-ok]: The project I used this for was a Symfony build so generated code is perfectly standard, but other (older?) codebases may require some setup for this to work.
[^fn-logging-tests]: This is because the code for logging is decoupled from the business logic and so could be removed/not parsed without obvious signs of breakage. If a logger class were being injected you could assume an exception would be thrown if it didn't build correctly, but if someone accidentally removes the AOP logging bundle there may be no noticeable problem until you want to check the logs and find nothing there.
