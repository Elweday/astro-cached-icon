# astro-cached-icon
> This package is still in beta, don't use in production
**Effortlessly integrate Iconify icons into your Astro projects with caching and bundling for optimal performance.**

## Features

- **Seamless integration with Astro:** Works effortlessly within Astro's component model.
- **Iconify compatibility:** Leverages the vast collection of icons from Iconify.
- **Caching and bundling:** Optimizes loading times by caching icons and bundling them into your Astro project.
- **Existence check:** Ensures icons are available before rendering, preventing errors.
- **TypeScript support:** Provides type safety and enhanced code completion.
- **Flexible usage:** Supports both `name` and `pack` props or a combined `icon` prop for convenient icon selection.
- **Customizable SVG attributes:** Allows for fine-grained control over SVG attributes.


## Motive
this package is heavily inspired by 
- [astro-icon](https://github.com/natemoo-re/astro-icon)
- [astro-preload](https://github.com/LyonSyonII/astro-preload/)
and is basically created to fix their shortcomings


## Installation 

```bash
npm install astro-cached-icon
```
just import and use

```jsx
import Icon from 'astro-cached-icon';

```


## Usage 

```jsx
<Icon name="home" pack="mdi" />
```

or the shorthand 
> this is preferred
```jsx
<Icon icon="mdi:home" />
```

it also takes normal SVG attributes
```jsx
<Icon name="home" pack="mdi" width="24" height="24" class="icon-custom" style="color: red;" />
```

## recommendations 
use [Iconify Intellisence VSCode extention](https://open-vsx.org/extension/antfu/iconify) if working with vscode to get preview and completion.
![VSCode](/images/vscode.jpg) 

## Additional notes

- Refer to the Iconify documentation for available icon packs and names: [https://iconify.design/](https://iconify.design/)
- For more advanced usage and configuration options, check out the package's GitHub repository.

## Contributing
Contributions are welcome! Please refer to the contribution guidelines in the GitHub repository.

## npm 
[astro-cached-icon](https://www.npmjs.com/package/astro-cached-icon)

