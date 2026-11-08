# gap 34: a function called `send` makes every calling module carry the sermo prelude

```text
faber check .                     error[PKG001:package_ts_merge_collision] ... span: <none>
faber emit -t ts .                the same
faber run .                       prints "a 1.0" and "b 1.0"
```

`synth.send(...)` is an ordinary user function. Every module that calls it
(`a`, `b`) gets the language's stream prelude appended to its TypeScript (the
`status` variants `request item byte bulk done error cancel`, and the classes
`scrinium`, `sermo_`, `meus`, `tuus`, visible with `faber build` in
`faber-ts/<module>.ts`), as if `send` were the stream operation. Two such
modules declare the same top-level names, and `faber check` of the package
merges its units into one stream and fails with no name and no span (the
message that names the duplicate is dropped from the diagnostic). Renaming the
function (`post`) makes both go away.

Expected: a user function named `send` is an ordinary function; and a merge
collision names the duplicate declaration.

Used by: `app/src/synth.fab` calls its function `post`; marked `# gap 34`.
