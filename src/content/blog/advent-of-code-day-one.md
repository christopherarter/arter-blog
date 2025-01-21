---
title: "Advent of Code Day One"
slug: "advent-of-code-day-one"
subtitle: ""
author: "Chris Arter"
publishDate: "2020-12-01T15:50:59.847Z"
dateUpdated: "2020-12-01T17:20:43.911Z"
---

**WARNING: SPOILERS**

Despite being swamped with work (like many of us are) I think it's important to stay sharp, so this year I'll be participating, however much I can, in [Advent of Code](https://adventofcode.com/) . I'll level with you all that I probably won't do every problem, but here is day one:

The first day is a two part problem:

1.  Given an unordered list of integers, find the two integers that add up to `2020` and return their product.
    
2.  Given the same list, find the 3 integers that add up to `2020` and return their product.
    

I decided to sort the list to provide a faster binary search. This is my C# solution, which is not my main language so it was a great opportunity to dust off my skills:

    using System;
    using System.Collections.Generic;
    using System.Linq;
    namespace advent_of_code_2020
    {
        class Day1
        {
            public int TargetNumber = 2020;
    
            public Day1()
            {
                PuzzleInput.Sort();
            }
    
            public void solve()
            {
                part1();
                part2();
            }
    
            protected void part1()
            {
                foreach (int item in PuzzleInput)
                {
                    var diff = TargetNumber - item;
                    if (PuzzleInput.BinarySearch(diff) > -1)
                    {
                        var answer = item * diff;
                        Console.WriteLine(answer.ToString());
                    }
                }
            }
    
            protected void part2()
            {
                foreach(int item in PuzzleInput)
                {
                    foreach (int subItem in PuzzleInput)
                    {
                        var diff = TargetNumber - (item + subItem);
    
                        if (PuzzleInput.BinarySearch(diff) > -1)
                        {
                            var answer = (diff * item) * subItem;
                            Console.WriteLine(answer.ToString());
                        }
                    }
                }
            }
    
            public List<int> PuzzleInput = new List<int> {  ... };
        }
    }
    

If you're curious, you can follow along in this repo: https://github.com/christopherarter/advent-of-code-2020

Please, drop me a comment with a link to your repo, too! 👇