![Tests passing](https://travis-ci.org/plestik/vorm.svg?branch=master)
# vorm
Generate dynamic, stateful Angular forms via JSON, JavaScript Objects or HTML and still talk to the same API.

## What does vorm do?

Vorm is an Angular module for generating (via JSON/HTML) and decorating (HTML) forms and form controls. No matter how you write your forms, the same API is available. 

## Features

#### Generate form controls with JSON & JavaScript objects 

Simply pass an array of configuration objects (of which only `name` and `type` are optional) to `vorm` and it'll take care of the rest. Supported by default: `text`, `number`, `textarea`, `select`, `radio`, `checkbox`, `date`, and more.

* [01 - Generate a simple form with JSON](http://plestik.github.io/vorm/examples/01/)
* [04 - Core field types](http://plestik.github.io/vorm/examples/04/)

#### Dynamic form state

You can easily adjust form state via so-called `invokables`, which can be a primitive, an object, a function or an array/injectable. Hide and show fields, change a label or the  options of a select box, or set the required state, based on form values or any other part of your application state.

* [06 - Dynamic forms](http://plestik.github.io/vorm/examples/06/)

#### Every field supports any number of controls

The default number of controls for any field is 1, but you can allow the user to add any number of controls via the configuration object. This is very useful when you want to support more than one value. Think, for example, of a field which allows the user to fill in one or more IP addresses.

* [05 - Allow multiple controls per field](http://plestik.github.io/vorm/examples/05/)

#### Theming

With the `vormTemplateServiceProvider` you can either customize or override the wrapper, control list, and model templates.

* [03 - Using a custom theme (in this case, Angular Material)](http://plestik.github.io/vorm/examples/03/)

#### Adding your own controls

`vorm` supports any control which is based on `ngModel` out of the box. No extra work is required (or even possible).

#### Fine-grained control

You have access to all the building blocks, which means you can write your forms any which way you please. Via JSON, JavaScript Objects but also via HTML (including wrapping existing form controls via `vorm-field-wrapper`).

* [02 - Generate a simple form with HTML](http://plestik.github.io/vorm/examples/02/)

## How do I get started?

For now, read the source code, [ping me on Twitter](https://twitter.com/plestik), or check out the examples:
* [01 - Generate a simple form with JSON](http://plestik.github.io/vorm/examples/01/)
* [02 - Generate a simple form with HTML](http://plestik.github.io/vorm/examples/02/)
* [03 - Using a custom theme (in this case, Angular Material)](http://plestik.github.io/vorm/examples/03/)
* [04 - Core field types](http://plestik.github.io/vorm/examples/04/)
* [05 - Allow multiple controls per field](http://plestik.github.io/vorm/examples/05/)
* [06 - Dynamic forms](http://plestik.github.io/vorm/examples/06/)

More to come!

### Things to do before the first release:
- [x] Support all basic input types
- [x] Example of dynamic forms
- [ ] Ability to lock/unlock fields
