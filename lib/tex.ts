// Tagged-template helper that returns the raw source string unchanged.
// Use this for KaTeX content so we can write LaTeX naturally with single
// backslashes (e.g. `\mathbf{v}`) without fighting JS escape rules and
// without triggering bundler bugs around \b, \t, \v inside JSX prop literals.
//
// Lives in a non-client module so it can be invoked from server components
// at build time (the resulting plain string is then handed to the client
// <Block>/<M> components as a regular prop).
//
// Example:  <Block>{tex`\mathbf{v} = \begin{bmatrix} 3 \\ 2 \end{bmatrix}`}</Block>
export function tex(
  strings: TemplateStringsArray,
  ...values: ReadonlyArray<string | number>
): string {
  return String.raw({ raw: strings.raw }, ...values);
}
