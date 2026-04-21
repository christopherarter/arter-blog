---
title: 'Bully'
description: 'A lint pipeline for Claude Code that fails the tool call when an edit violates your rules'
publishDate: 'Apr 20 2026'
---

CLAUDE.md asks. Bully enforces.

When you tell Claude Code "don't use `console.log`" or "no `as any` casts" in CLAUDE.md, it forgets. Not on the next edit, but eventually. The instructions are advisory; nothing checks the diff.

Bully wires a `PostToolUse` hook into Claude Code. Every `Edit` and `Write` runs through a pipeline that checks the change against `.bully.yml`. Error-severity rules block the tool call by exiting with code 2, so Claude has to fix the violation before the edit lands. Warnings surface in the transcript without blocking.

## Three engines, one config

Rules in `.bully.yml` pick an engine based on what they need to check:

- `script` runs a shell command (grep, jq, a project linter). Deterministic; exit code wins.
- `ast` runs a structural pattern through [ast-grep](https://ast-grep.github.io/), so it ignores formatting variants, comments, and string contents.
- `semantic` ships the unified diff plus a plain-English description to a subagent (`bully-evaluator`) that returns a structured verdict.

The first two cover the rules a regex can express. The third covers the ones it can't, like "don't derive state from props with `useEffect`" or "inline single-use variables." All three share one trigger, one output format, and one fix loop, across every language in the repo.

## What a config looks like

```yaml
schema_version: 1

rules:
  no-console-log:
    description: 'No console.log in committed source. Use the project logger.'
    engine: script
    scope: ['src/**/*.ts', 'src/**/*.tsx']
    severity: error
    script: "grep -nE 'console\\.log\\(' {file} && exit 1 || exit 0"

  no-any-cast:
    description: 'No `as any` casts. Use a precise type or `unknown` plus narrowing.'
    engine: ast
    scope: ['src/**/*.ts', 'src/**/*.tsx']
    severity: error
    pattern: '$EXPR as any'

  prefer-derived-state:
    description: >
      React components should not use useEffect to derive state from
      props. Compute the value directly during render (or with useMemo
      if expensive). Effect-based derivation causes unnecessary renders
      and stale reads.
    engine: semantic
    scope: 'src/**/*.tsx'
    severity: warning
```

Adopting bully in an existing repo with pre-existing violations would normally light up every old problem. `bully baseline-init` records the current state in `.bully/baseline.json` so only new violations block edits.

## Install

Bully ships as a Claude Code plugin:

```
/plugin marketplace add https://github.com/dynamik-dev/bully
/plugin install bully
```

That installs the skills (`bully-init` to bootstrap a config, `bully-author` to add or modify rules, `bully-review` to surface noisy or dead rules from telemetry), the evaluator subagent, and the PostToolUse hook. Restart Claude Code, then run `bully doctor` to verify.

[GitHub](https://github.com/dynamik-dev/bully)
