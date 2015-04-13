![Tests passing](https://travis-ci.org/plestik/vorm.svg?branch=master)
# vorm
Write your Angular forms in JSON and HTML, use the same API.

## What does vorm do?

Vorm is an Angular module for generating (via JSON/HTML) and decorating (HTML) forms and form controls. No matter how you write your forms, the same API is available. 

## What makes vorm different from other libraries?

Vorm has two features which as far as I can tell set it apart: 

#### 1. Use both JSON and HTML for generating or decorating your forms

There are three ways to create a form:
- Using the `vorm-fieldset` directive and passing it an array of field configuration objects.
- Using the `vorm-fieldset-template` directive and specifying a name, type and label (and other optional attributes).
- Using the `vorm-field-wrapper` directive to decorate existing controls. The directive will unpack its contents and wrap it with the default wrapper template.

#### 2. Multiple controls per field are supported out of the box

You can add any number of controls, of any type, to a `vorm-field`, and it will resolve the values for you in a smart way. It makes two things easy: nested (mini-)forms and lists of controls. The latter is especially helpful if the user needs to provide a list for a certain property instead of just one value (for instance, a list of airports the user wishes to travel from). This is the main reason this library exists.

## What else does it do?
* Customize/override wrap and control templates
* Dynamic data for controls via _invokables_ (primitives, booleans or (annotated) functions)
* Various HTML form controls supported by default (`input`, `select`, `textarea` and all their variations)
* Easily add any custom control that depends on `ngModel`

## How do I get started?

For now, read the source code, [ping me on Twitter](https://twitter.com/plestik), or check out the examples:
* [01 - Generate a simple form with JSON](http://plestik.github.io/vorm/examples/01/)
* [02 - Generate a simple form with HTML](http://plestik.github.io/vorm/examples/02/)
* [03 - Using a custom theme (in this case, Angular Material)](http://plestik.github.io/vorm/examples/03/)
* [04 - Core field types](http://plestik.github.io/vorm/examples/04/)
* [05 - Allow multiple controls per field](http://plestik.github.io/vorm/examples/05/)

More to come!

### Things to do before the first release:
- [x] Support all basic input types
- [ ] Example of dynamic forms
- [ ] Ability to lock/unlock fields

