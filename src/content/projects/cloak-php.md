---
title: 'Cloak PHP'
description: 'PHP library that redacts sensitive values from strings, then puts them back when you need them'
publishDate: 'Nov 20 2025'
---

When an app sends text to a third-party LLM or logs a request payload, any email, phone number, or SSN in that string leaves the trust boundary. Cloak replaces those values with reversible placeholders before the string goes out, and swaps them back on the way in.

```php
$cloaked = cloak('Email me at john@example.com');
// "Email me at {{EMAIL_x7k2m9_1}}"

$original = uncloak($cloaked);
// "Email me at john@example.com"
```

## Detectors

Out of the box, Cloak ships detectors for emails, phone numbers, SSNs, and credit cards. Pick the ones you want per call, or use `Detector::all()`:

```php
use DynamikDev\Cloak\Detector;

$cloaked = cloak($text, [
    Detector::email(),
    Detector::phone('US'),
    Detector::ssn(),
]);
```

Phone detection uses [libphonenumber-for-php](https://github.com/giggsey/libphonenumber-for-php), so `Order #123456789012` does not get cloaked as a phone number. Order IDs, timestamps, and serial numbers that happen to look phone-shaped get filtered.

## Custom detectors

Three ways to add one. A regex:

```php
$detector = Detector::pattern('/\b[A-Z]{2}\d{6}\b/', 'passport');
```

A word list:

```php
$detector = Detector::words(['password', 'secret'], 'sensitive');
```

Or a closure that returns its own matches:

```php
$detector = Detector::using(function (string $text): array {
    $matches = [];
    if (preg_match_all('/\bAPI_KEY_\w+\b/', $text, $found)) {
        foreach ($found[0] as $match) {
            $matches[] = ['match' => $match, 'type' => 'api_key'];
        }
    }
    return $matches;
});
```

For heavier logic, implement `DetectorInterface` directly.

## Placeholders are deterministic per call

Placeholders use `{{TYPE_KEY_INDEX}}` where the key is unique per cloak operation. Repeated values reuse the same placeholder inside one call, so `uncloak` reverses a round-trip exactly. The generator is swappable (`PlaceholderGeneratorInterface`) if you want UUIDs, bracketed tags, or anything else.

## Encryption at rest

The placeholder map lives in a store. By default that's an in-memory `ArrayStore`; for persistence you implement `StoreInterface` against Redis, the Laravel cache, or whatever fits. Values in the store can be encrypted:

```php
use DynamikDev\Cloak\Encryptors\OpenSslEncryptor;

$cloak = Cloak::make()
    ->encrypt(OpenSslEncryptor::generateKey());
```

The key reads from `CLOAK_PRIVATE_KEY` when you call `->encrypt()` with no argument. Custom encryptors (sodium, KMS, whatever) plug in through `withEncryptor()`.

## Filters and callbacks

Filter out detections before they get cloaked:

```php
$cloak = Cloak::make()
    ->filter(fn ($d) => !str_ends_with($d['match'], '@test.local'));
```

Lifecycle hooks (`beforeCloak`, `afterCloak`, `beforeUncloak`, `afterUncloak`) are there for normalization, logging, or validation around the core operation.

## Install

```bash
composer require dynamik-dev/cloak-php
```

Requires PHP 8.2+ and `ext-mbstring`.

[GitHub](https://github.com/dynamik-dev/cloak-php)
