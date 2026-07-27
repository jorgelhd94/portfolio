# Writing Comments

Adapted from the [Astro repository's skill of the same name](https://github.com/withastro/astro/blob/main/.agents/skills/writing-comments/SKILL.md)
(MIT). The monorepo-specific sections are dropped; the rules are not.

## The Reader

Write for someone competent in TypeScript and CSS who has **no access to your
current context**: not the conversation that produced the code, not the commit
message, not the diff. They see only the repository at HEAD.

Two consequences follow:

1. **Never narrate change history.** "Now", "previously", "no longer", "the new
   approach" are meaningless at HEAD, where only one approach exists. State how
   the code works, not how it came to be.
2. **Never address a reviewer.** A comment arguing that the code is correct
   ("this properly handles X") belongs in a commit message. A comment must
   justify the code as it stands, permanently.

## Three Kinds, Three Jobs

| Kind             | Syntax                          | Job         | Contains                                                             |
| ---------------- | ------------------------------- | ----------- | -------------------------------------------------------------------- |
| Module overview  | `/** */` at the top of a file   | Explanation | Why the module exists, the concepts it defines, how the pieces relate |
| Item docs        | `/** */` above a declaration    | Reference   | The contract: behaviour, parameters, return value, invariants         |
| Inline           | `//` inside a body              | Rationale   | Only what the code cannot say: constraints, couplings, workarounds    |

Do not mix them. Implementation detail does not belong in a `/** */` contract;
the contract does not belong scattered across inline comments.

## The Deletion Test

Before writing any comment, ask: **does this state something the reader cannot
recover from the code itself?**

If names, types or structure already carry it, do not write the comment — and if
the name fails to carry it, fix the name instead. What legitimately needs a
comment: an invariant, a rationale, a coupling to code elsewhere, surprising
behaviour of a browser or dependency, a term the module defines.

The same test applies in reverse when editing: a comment that no longer passes
it should be deleted, not left to rot.

## What This Project Keeps

This is a design-heavy repository, and most of its hard-won knowledge is about
*why a value is what it is*. These are worth a comment:

- **A number that was tuned by eye.** A cell pitch, a stagger delay, a noise
  threshold. Say what breaks at other values, not what the number is.
- **A browser trap.** `overflow: hidden` making an ancestor a scroll container
  and killing `position: sticky`; a minifier folding `animation-timeline` into
  the `animation` shorthand, where it is a reset-only sub-property. These cost
  real time to rediscover.
- **A design rule that spans files.** The palette rule in `global.css` is
  binding on every component; a reader changing a colour needs to meet it.
- **Silent failures.** Assigning a malformed shorthand to `ctx.font` is a no-op
  that reports nothing.

## Banned Patterns

**Narrating the next line.** Delete on sight:

```ts
// Increment the counter
count += 1;
```

**Restating a name.** A block that rewords the declaration says nothing:

```ts
// BAD
/** Builds the mask. */
const buildMask = () => { ... }

// GOOD
/** Rasterises the text at SUPERSAMPLE resolution and marks every cell whose
 *  coverage clears COVERAGE_THRESHOLD. Row count falls out of the type rather
 *  than being imposed on it. */
const buildMask = () => { ... }
```

**Design-diary prose.** This repository has a real failure mode: comments that
retell the design conversation. The reader needs the constraint, not the
journey.

```ts
// BAD: The pattern doesn't survive at this scale, so after trying it in the
//      buttons we went back to a plain fill.
// GOOD: (nothing — delete it)
```

**Vague hedging.** "Some cases", "various reasons", "handles edge cases" —
either name them or drop the sentence.

**Section banners** (`// ----- helpers -----`). If a file is long enough that
you reach for one, split the file.

## Editing Existing Code

Preserve existing comments. If your change alters behaviour, correct the
specific prose rather than replacing it with something generic. When your change
makes a comment false, fix it in the same diff — a stale comment is worse than
none. Match the surrounding density: do not blanket a sparse file.

## Self-Check

After any task that touched comments, re-read **only the comments in your
diff**, in isolation:

1. Does each one pass the deletion test?
2. Does any reference the conversation, the change itself, or a reviewer?
3. Would a reader without the diff understand it?

Deletion is the default. A missing comment is cheaper than a misleading one.
