---
title: 'Splitr'
description: 'A high-precision, zero-dependency TypeScript library for traffic and outcome splitting'
publishDate: 'Oct 5 2021'
---

Splitr is a minimalist TypeScript library designed for highly accurate traffic splitting and outcome distribution. With near 100% precision and zero dependencies, it provides a reliable solution for A/B testing, feature flagging, or any scenario requiring weighted random selection.

## Key Features

- **High Precision**: Achieves 99.95% - 99.97% accuracy in split distributions
- **Zero Dependencies**: Completely standalone with no external requirements
- **TypeScript Native**: Built with full type safety and modern TypeScript features
- **Minimalist API**: Simple, intuitive interface for defining and executing splits
- **Flexible Usage**: Perfect for A/B testing, traffic distribution, or any weighted selection needs

## How It Works

Splitr uses a weighted distribution algorithm to ensure outcomes match their specified probabilities with extremely high accuracy. Each option is assigned a weight (percentage), and the sum of all weights must equal 100.

## Example Usage

Here's a simple example demonstrating traffic splitting:

```typescript
const options = [
    {
        weight: 10,
        value: "10% of the time",
    },
    {
        weight: 20,
        value: "20% of the time",
    },
    {
        weight: 70,
        value: "70% of the time",
    },
];

const splitr = new Splitr(options);
const result = splitr.run();
// Returns one of the values based on their weights
```

Splitr's combination of simplicity, accuracy, and zero dependencies makes it an excellent choice for developers who need reliable outcome splitting without the overhead of larger libraries.

[GitHub](https://github.com/christopherarter/splitr)