# My Little Corner

A simple website with: home, about, art, cooking, crafts, iconography study, home making, blog, and a music player that keeps playing while you browse.

## Files

- `index.html`: all the pages and text
- `style.css`: colors, fonts, layout (colors are at the top of the file)
- `script.js`: music playlist (top of file), page switching, lightbox
- `images/`: your pictures
- `music/`: your mp3 files

## Customize it

1. **Text:** open `index.html` and replace the sample text.
2. **Images:** put files in `images/` using the names in the HTML (`art-1.jpg`, `me.jpg`, ...), or change the names in the HTML. Missing images show a striped placeholder box.
3. **Music:** put mp3s in `music/`, then edit the `TRACKS` list at the top of `script.js`. Browsers block autoplay, so visitors press play themselves.
4. **New blog post:** copy an `<article class="post">` block in the blog section and paste it at the top. Change `data-date`, the title, date and text. The home page's "latest" list updates itself.
5. **New recipe / art piece / craft:** copy an existing block and edit it.
6. **Colors and fonts:** edit the `:root` section at the top of `style.css`.

## Put it online (free)

- **Neocities:** log in, drag all of these files and folders into the dashboard.
- **Cloudflare Pages / Netlify / GitHub Pages:** upload this folder. All are free, and each can use your own domain.

To preview locally, just double-click `index.html`.
