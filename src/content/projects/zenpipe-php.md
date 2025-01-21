---
title: 'ZenPipe PHP'
description: 'A simple and flexible PHP pipeline library for elegant data transformation and processing'
publishDate: 'Jan 16 2024'
---

ZenPipe is a modern PHP library that brings elegance and simplicity to data processing pipelines. Built with developer experience in mind, it enables you to chain operations together in a clean, functional style to transform, validate, or process data.

## Key Features

- **Simple and Intuitive API**: Chain operations together using a fluent interface
- **Flexible Operation Handling**: Support for closures, class methods, and arrays of operations
- **Early Returns**: Gracefully exit pipelines early when needed
- **Type Safety**: Built for PHP 8.2+ with full type hinting support
- **Zero Dependencies**: Lightweight and standalone

## Real-World Applications

ZenPipe excels in various scenarios:

- **Data Sanitization**: Chain multiple cleaning operations for user input
- **Content Moderation**: Build sophisticated content filtering pipelines
- **RAG Processes**: Create seamless chains for AI/ML processing
- **Validation Logic**: Implement complex validation rules with early returns
- **ETL Operations**: Transform and process data through multiple stages

## Example Usage

Here's a simple example that applies a discount and tax calculation:

```php
$calculator = zenpipe()
   ->pipe(fn($price, $next) => $next($price * 0.8)) // 20% discount  
   ->pipe(fn($price, $next) => $next($price * 1.1)); // add 10% tax

$calculator(100); // $88 (100 -> 80 -> 88)
```

ZenPipe's power lies in its simplicity and flexibility, making it an invaluable tool for developers who value clean, maintainable code and efficient data processing workflows.

[GitHub](https://github.com/dynamik-dev/zenpipe-php)