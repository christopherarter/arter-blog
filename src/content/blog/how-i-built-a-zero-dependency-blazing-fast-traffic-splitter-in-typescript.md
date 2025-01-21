---
title: "How I Built A Zero-dependency, Blazing-fast Traffic Splitter in TypeScript"
slug: "how-i-built-a-zero-dependency-blazing-fast-traffic-splitter-in-typescript"
subtitle: ""
author: "Chris Arter"
publishDate: "2021-10-09T13:12:49.535Z"
dateUpdated: "2021-10-11T14:41:13.883Z"
---

Recently, I was given a requirement to split traffic according to a very flexible set of rules.

### Requirements

*   **Flexible**. It needed to split traffic in 2, 3, 4, ... etc different directions, each with a weighted split. For example: 10% to A, 20% to B, and 70% to C.
*   **Accurate**. It needed to split traffic _exactly_ (or as close to exact as we could get). My earlier iterations relied on a random number falling within a set of ranges, but this was not an accurate split, just a way to weight the chances of the outcome. We needed a way to split traffic exactly to a given set of percentages.
*   **Fast**. Because this traffic splitter could potentially bottleneck our funnel, it was important it was design for high throughput.

#### First Attempts

My first attempt was written during a meeting (I know, I know).

    const splitArray = [
      {
        percentage: 10,
        value: (input) => {
          return `Hey ${input}, do this 10% of the time`;
        }
      },
      {
        percentage: 20,
        value: (input) => {
          return `Hey ${input}, do this 20% of the time`;
        }
      },
      {
        percentage: 70,
        value: (input) => {
          return `Hey ${input}, do this 70% of the time`;
        }
      }
    ];
    
    const splitTraffic = (input, splits) => {
      let randomValue = Math.random() * (100 - 0);
      let min = 0;
      let max = 0;
      [].concat(splits)
        .sort((a, b) => {
          return a.percentage > b.percentage;
        })
        .forEach((item, index) => {
          if (index === 0) min = 0;
          max = item.percentage;
          if (randomValue >= min && randomValue <= max) {
            let result = item.value(input);
            console.log(result);
          }
          min = item.percentage;
        });
    };
    
    for (let i = 0; i < 100; i++) {
      splitTraffic("Chris", splitArray);
    }
    

My first attempt iterated through an array of weight objects and used pointers `min` and `max` to determine if the random number fell into the range. While this solution _generally_ worked, it didn't **ensure** the split %, just weighted the chances of the outcome.

There were also linear & logarithmic complexities with `sort()` and `forEach()` that were OK, but not ideal.

### Quest for O(1)

[via GIPHY](https://giphy.com/gifs/indiana-jones-harrison-ford-9J8gnvAxmDFbG)

I decided this first iteration was not accurate enough nor fast enough. Then, I got an idea sparked by a conversation on twitter:

> I usually push them all into an array and then pick at random.  
>   
> So push e.g. 10 of the "Hey 10% of the time", 20 of the "Hey 20% of the time" values into an array, and then pick a random value from the array.
> 
> — Aaron Francis (@aarondfrancis) [September 22, 2021](https://twitter.com/aarondfrancis/status/1440750593186811907?ref_src=twsrc%5Etfw)

While Aaron's approach was still facing the accuracy issue, the idea behind it was to **trade time complexity for space complexity.**

I decided to riff on the idea and instead of picking a number at random, I would shuffle the array of _n_ items and just pick one off the top. It would be more work up front, but every call after that would be.. **O(1)**.

This would also ensure the accuracy of the split, because the array of weights would contain _exactly_ the correct number of items each weight declared.

So for our example, our object of `{ weight: 10, value: 'Do this 10% of the time' }` would be represented in our array as:

       const ourArray = [
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
        { weight: 10, value: 'Do this 10% of the time' },
    ];
    

The same would happen for the next split, `{weight: 20, value: 'Do this 20% of the time'}` and so on. To prevent all of the splits being sequential, we shuffle the array.

It's important that each time we split traffic, that we remove an item from our array of split instances, so that we do not keep sending it to the same location over and over.

#### Dual Queue Approach

At first, I started with two queues. Queue A was full of our _n_ number of weights (10 of the 10-weights, 20 of the 20-weights, 70 of the 70-weights). Queue B was empty.

![Screen Shot 2021-10-09 at 8.59.22 AM.png](/images/1737473617712-PonMoXbIa.png)

When the splitter routes traffic, it pulls the item from Queue A and puts it into Queue B.

![Screen Shot 2021-10-09 at 9.02.07 AM.png](/images/1737473618023-BKNKmtCV-.png)

When Queue B is full, it puts all of the items into Queue A and empties itself.

#### Index approach

We can achieve even better performance if we eliminate the secondary queue all together and only track the current index in Queue A, or just "Queue". When the current index reaches the end of the array, it resets itself to 0. This eliminates complexity.

![Screen Shot 2021-10-09 at 9.05.21 AM.png](/images/1737473618286-s9MRxdqcB.png)

The final splitter code looks like this:

    import SplitOption from "./types/splitOption";
    class Splitr {
      protected queue: SplitOption[];
      protected splits: SplitOption[];
      protected currentIndex: number;
      constructor(splits: SplitOption[]) {
        this.validate(splits);
        this.splits = splits;
        this.queue = [];
        this.currentIndex = 0;
        this.fillQueue();
        this.shuffleQueue();
      }
    
      protected fillQueue() {
        this.splits.forEach((split: SplitOption) => {
          for (let i = 0; i < split.weight; i++) {
            this.queue.push(split);
          }
        });
      }
    
      protected shuffleQueue() {
        for (let i = this.queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
      }
    
      public run(): SplitOption {
        const result = this.queue[this.currentIndex];
        this.currentIndex++;
        if (this.currentIndex == this.queue.length) {
          this.currentIndex = 0;
        }
        return result;
      }
    
      protected validate(splits: SplitOption[]) {
        const sum = this.sumOfSplitWeights(splits);
        if (sum !== 100) {
          throw new Error(
            `splittr: Split weights must equal 100, received ${sum}.`
          );
        }
      }
    
      protected sumOfSplitWeights(splits: SplitOption[]) {
        let total = 0;
        splits.forEach((split: SplitOption) => {
          total = total + split.weight;
        });
        return total;
      }
    }
    export default Splitr;
    

### Github Repo

And that's it! I opened sourced this splitter at this repo: https://github.com/christopherarter/splitr and PRs are always welcomed. Happy coding!