---
title: "Advent of Code Day Three"
slug: "advent-of-code-day-three"
subtitle: ""
author: "Chris Arter"
publishDate: "2020-12-03T16:21:34.655Z"
dateUpdated: "2020-12-03T16:21:57.305Z"
---

This one seemed hard AF. Then seemed pretty easy, then seemed hard again.

Then after looking at some different hints & approaches (is this cheating?) I came up with my own flavor of solution:

    using System;
    using System.Collections.Generic;
    using System.Linq;
    namespace advent_of_code_2020
    {
        class Day3
        {
    
            public int TreeCount = 0;
    
            public string Tree = "#";
    
            public void solve(){
                part1();
                part2();
            }
    
            public void part1()
            {
                ThoseTreesTho(3, 1);
                Console.WriteLine(TreeCount);
            }
    
            public void part2()
            {
                var mValues = new int[] {
                    ThoseTreesTho(1, 1),
                    ThoseTreesTho(3, 1),
                    ThoseTreesTho(5, 1),
                    ThoseTreesTho(7, 1),
                    ThoseTreesTho(1, 2)
                };
    
                Int64 answer = 1;
    
                foreach(int val in mValues)
                {       
                    answer *= val;
                }
    
                Console.WriteLine(answer);
            }
    
            private int ThoseTreesTho(int xSlope, int ySlope)
            {
                TreeCount = 0;
                var x = xSlope;
                var y = ySlope;
                while (y < PuzzleInput.Count)
                {
                    if (PuzzleInput[y][x] == Convert.ToChar(Tree)) 
                    {
                        TreeCount++;
                    }
                    y += ySlope;
                    x = (x + xSlope) % PuzzleInput[0].Count();
                }
                return TreeCount;
            }
    
            protected List<string> PuzzleInput = new List<string>() { 
                //...
             };
    
        }
    }