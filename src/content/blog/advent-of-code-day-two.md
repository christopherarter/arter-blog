---
title: "Advent of Code Day Two"
slug: "advent-of-code-day-two"
subtitle: ""
author: "Chris Arter"
publishDate: "2020-12-03T00:53:05.831Z"
dateUpdated: ""
---

**SPOILERS**

This one ended up being a bit trickier than I anticipated in part 2, but eventually I got it:

    using System;
    using System.Collections.Generic;
    using System.Text.RegularExpressions;
    using System.Linq;
    namespace advent_of_code_2020
    {
        class Day2
        {
            protected List<String> PuzzleInput = new List<String>() { ... };
    
            public void solve()
            {
                part1();
                part2();
            }
    
            public void part1()
            {
                var correctPasswords = new List<Password>();
                foreach (string password in PuzzleInput)
                {
                    var testPass = new Password(password);
                    if (testPass.IsValid())
                    {
                        correctPasswords.Add(testPass);
                    }
                }
                Console.WriteLine("The answer to part 1 is {0}", correctPasswords.Count);
            }
    
            public void part2()
            {
                var correctPasswords = new List<Password>();
                foreach (string password in PuzzleInput)
                {
                    var testPass = new Password(password);
                    if(testPass.IsValid2())
                    {
                        correctPasswords.Add(testPass);
                    }
                }
               Console.WriteLine("The answer to part 2 is {0}", correctPasswords.Count);
            }
    
        }
    
        class Password
        {
            public int PasswordMin;
            public int PasswordMax;
            public string Letter;
            public string PasswordString;
            public string InputString;
            public char Position1Char;
            public char Position2Char;
    
            public int CharacterFrequency;
            public Password(string inputString)
            {
                InputString = inputString;
                SetProperties();
                SetPositionChars();
            }
    
            protected void SetProperties()
            {
                var matches = Regex.Matches(InputString, @"(\d*)[^-](\d*)[^ ](\w*)");
                PasswordMin = Int32.Parse(matches[0].Value.Split('-')[0]);
                PasswordMax = Int32.Parse(matches[0].Value.Split('-')[1]);
                Letter = matches[1].Value.Replace(" ", "");
                PasswordString = matches[2].Value.Replace(" ", "");
                CharacterFrequency = PasswordString.Split(Letter).Count() - 1;
            }
    
            public bool IsValid()
            {
                return CharacterFrequency >= PasswordMin && CharacterFrequency <= PasswordMax;
            }
    
            public bool IsValid2()
            {
                var letter = Convert.ToChar(Letter);
                if( letter == Position1Char && letter != Position2Char)
                {
                    return true;
                }
    
                if( letter == Position2Char && letter != Position1Char)
                {
                    return true;
                }
                return false;
            }
    
            protected void SetPositionChars()
            {
                var letter = Convert.ToChar(Letter);
                if( (PasswordMin - 1) <= PasswordString.Length )
                {
                    Position1Char = PasswordString[PasswordMin - 1];
                }
                if( (PasswordMax - 1) <= PasswordString.Length )
                {
                    Position2Char = PasswordString[PasswordMax - 1];
                }
            }
        }
    
    }