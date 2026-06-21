
- ~~Once you click on a pin-card, the visit button and the counters remained visible.~~ 

- Infinite scrolling ? 

- ~~Fix the style for focus state - the bar has one style the other elements the standard.~~

Unsplash
- Fix the "Latest" issue.

- ~~Do something with the buttons in the header?~~ => NOPE

NOTAS PARA docs

Estrategias de diseño snippets

- Estrategia para focus-visible styles and shared focus ring tokens.  Todos los elementos tienen un estilo visualmente igual cuando focus.
The overall strategy uses :hover for pointer feedback and :focus-visible for keyboard navigation, avoiding persistent focus decoration after ordinary mouse clicks while ensuring keyboard users receive a consistent, clearly visible ring. The search bar uses the same token-based outline as every other interactive element.