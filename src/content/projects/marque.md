---
title: 'Marque'
description: 'Laravel authorization with scoped roles, deny rules, permission boundaries, and JSON policy documents'
publishDate: 'Apr 6 2026'
---

A [letter of marque](https://en.wikipedia.org/wiki/Letter_of_marque) was a government document that granted pirates scoped permission to plunder specific waters. Marque does roughly the same thing for Laravel authorization, minus the plundering. A user is admin in one team and viewer in another, and every permission check accepts a scope.

## Scoped roles

Spatie's `laravel-permission` covers flat RBAC well. Once you need "admin in Acme, viewer in Widget Co," you either glue team scoping on top or outgrow the package. Marque takes scope as a first-class argument:

```php
Marque::createRole('admin', 'Admin')
    ->grant(['members.*', 'posts.*'])
    ->assignTo($user, scope: $acmeTeam);

$user->can('members.remove', $acmeTeam);   // true
$user->can('members.remove', $widgetTeam); // false
```

A scope can be any model that implements `Scopeable`: teams, orgs, projects, plan tiers.

## Deny rules

Prefix a permission with `!` and that denial overrides every role that grants it. An editor with `posts.*` and `!posts.delete` has full post access except delete:

```php
Marque::createRole('editor', 'Editor')
    ->grant(['posts.*'])
    ->deny(['posts.delete']);
```

## Boundaries

A boundary caps what any role can do inside a scope, admins included. Plan tiers live in the authorization layer instead of scattered feature flag checks:

```php
Marque::boundary($freeOrg)->permits(['posts.read']);
Marque::boundary($proOrg)->permits(['posts.*', 'analytics.*']);

$user->assignRole('admin', $freeOrg);
$user->can('analytics.view', $freeOrg);  // false, boundary blocks it
$user->can('analytics.view', $proOrg);   // true
```

## JSON policy documents

Roles, boundaries, and deny rules can live in version-controlled JSON and import at deploy time:

```json
{
  "roles": [
    { "id": "editor", "permissions": ["posts.*", "!posts.delete"] }
  ],
  "boundaries": [
    { "scope": "plan::free", "max_permissions": ["posts.read"] }
  ]
}
```

```bash
php artisan marque:import policies/production.json
```

## Wired into the Gate

`$user->can()`, `@can`, `$this->authorize()`, and the `can:` route middleware work with no extra wiring. Existing code that already uses Laravel's Gate keeps working; Marque is the driver underneath.

## Install

```bash
composer require dynamik-dev/marque
```

[GitHub](https://github.com/dynamik-dev/marque)
