---
title: 'Dream AI Toolkit for Laravel'
description: 'A powerful Laravel package that seamlessly integrates AI/ML capabilities into your applications'
publishDate: 'Oct 15 2023'
---

Dream was a comprehensive AI/ML toolkit for Laravel that eliminates boilerplate code and makes advanced AI capabilities accessible through an elegant API. It was created in a time before LLMs, and various services from different cloud providers were best at different things. The goal of this package was to stich all the services together and provide a unified interface for developers to use.

It is no longer maintained or relevant, but it was a fun project to work on :)

## Key Features

- **Multiple AI Providers**: Supports OpenAI and AWS Comprehend with more coming soon
- **Natural Language Processing**: Advanced text analysis including sentiment analysis and entity extraction
- **Image Analysis**: OCR and image recognition capabilities through AWS Rekognition
- **Elegant API**: Intuitive, Laravel-style interface for all AI operations
- **Type Safety**: Full PHP 8.1 type hinting support
- **Extensible**: Easy to add custom AI providers and extend functionality

## Core Capabilities

Dream provides a rich set of AI features:

- **Sentiment Analysis**: Determine text sentiment (positive/negative/neutral)
- **Entity Extraction**: Identify people, places, dates, and more from text
- **Key Phrase Detection**: Extract important phrases from content
- **Language Detection**: Automatically identify text language
- **Image Text Detection**: Extract text from images (OCR)
- **Image Label Detection**: Identify objects and scenes in images

## Example Usage

Here's a quick example of sentiment analysis:

```php
use Dream\Facades\Dream;

$sentiment = Dream::text('I love Laravel!')->sentiment();
$sentiment->disposition(); // 'positive'
$sentiment->positive(); // true
```

And entity extraction:

```php
$entities = Dream::text('Meeting with John at Google HQ on Friday.')
    ->entities();

$entities->people(); // ['John']
$entities->organizations(); // ['Google HQ']
$entities->dates(); // ['Friday']
```

Dream's power lies in its ability to make complex AI operations feel native to Laravel, enabling developers to focus on building features rather than wrestling with AI service integrations.

[GitHub](https://github.com/christopherarter/dream)