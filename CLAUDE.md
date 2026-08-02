# CLAUDE.md

Project rules for AI-assisted work in this repository.

## Code Style Rules

- **No code comments.** Code must be self-explanatory through naming and structure. Do not add comments of any kind (inline, block, JSDoc, or TODO). If code needs a comment to be understood, refactor it instead.
- **No `any`.** The `any` type is forbidden in all its forms: explicit annotations (`: any`), assertions (`as any`), generics (`Array<any>`), and implicit `any`. Use precise types, generics, `unknown` with narrowing, or derived types (`keyof`, `typeof`) instead.

## Quality Gates

Every change must leave the project clean before it is considered done:

- **Zero TypeScript errors.** `bunx tsc --noEmit` must pass.
- **Zero Biome errors.** `bunx biome check .` must pass. Fix issues properly; do not silence them with ignore comments.
