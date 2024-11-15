export const examples = [
    {
        "inputTags": [
            "#redis",
            "#caching",
            "#security",
            "#docker",
            "#database",
            "#load-balancing",
            "#networking",
            "#database-backups"
        ],
        "document": `How to Set Up a Secure Redis Cache in Production

This guide walks through setting up Redis as a caching solution in a production environment, with a focus on security best practices. We'll cover:

1. Installing and configuring Redis with encryption
2. Setting up authentication
3. Implementing connection pooling
4. Configuring backup strategies
5. Monitoring cache performance

We'll use Docker for deployment and demonstrate integration with Node.js applications.`,
        "response": {
            "tags": [
                "#redis",
                "#caching",
                "#security",
                "#docker",
            ],
            "newTags": [
                "#production-deployment",
                "#infrastructure-monitoring",
            ],
        }
    },

    {
        "inputTags": [
            "#self-reflection",
            "#personal-growth",
            "#relationships",
            "#journaling",
            "#psychology",
            "#goal-setting",
        ],
        "document": `April 15, 2024

Today I realized something important about my tendency to overthink decisions. While having coffee with Sarah, she mentioned how quickly I shut down the idea of applying for that art workshop. My immediate response was to list all the reasons why it wouldn't work - time, money, my supposed lack of talent.

But sitting here now, I recognize this pattern. It's the same one that kept me from trying photography last year. I'm not afraid of failing as much as I'm afraid of being seen trying. There's a vulnerability in beginning something new, in being a novice.

Maybe this resistance is telling me exactly why I need to do this. I've spent so many years in my comfort zone that it's become less of a comfort and more of a cage.

Question to reflect on: What would I do if I knew no one was watching or judging?`,
        "response": {
            "tags": [
                "#self-reflection",
                "#personal-growth",
                "#relationships",
            ],
            "newTags": [
                "#fear-exploration",
                "#comfort-zone",
            ],
        }
    },

    {
        "inputTags": [
            "#literature",
            "#analysis",
            "#american-studies",
            "#classics",
            "#writing",
            "#reading-comprehension",
        ],
        "document": `ENG 405: Modern American Literature
Date: April 3, 2024
Book: "The Great Gatsby" - Chapter 4 Analysis

Symbolism & Motifs:
1. The Green Light
   - Represents Gatsby's hopes/dreams
   - Physical manifestation of the American Dream
   - Distance = unattainability

Character Development - Jay Gatsby
* Reveals true background to Nick
* Constructed identity vs. real identity
* Name change from James Gatz
   → Reinforces theme of reinvention

Historical Context:
- Prohibition era details
- Jazz Age social customs
- Class mobility in 1920s

Professor's Emphasis:
* Focus on unreliable narrator perspective
* Parallel between Gatsby's fabrication and nation's self-image
* Importance of time/past in narrative

Essay Topics Discussed:
1. Role of wealth in character relationships
2. Corruption of the American Dream
3. Impact of social class on personal identity`,
        "response": {
            "tags": [
                "#literature",
                "#analysis",
                "#american-studies",
            ],
            "newTags": [
                "#literary-symbolism",
                "#character-study",
            ],
        }
    },

    {
        "inputTags": [
            "#microservices",
            "#devops",
            "#team-management",
            "#agile",
            "#software-testing",
            "#version-control",
            "#code-quality",
        ],
        "document": `Impact of Microservices on Team Productivity

Our 6-month study across 12 development teams revealed that transitioning from monolithic to microservices architecture led to:

"40% reduction in deployment failures",
"60% faster feature delivery",
"Increased team autonomy",
"Higher maintenance complexity",
"Need for improved service discovery",

However, teams smaller than 8 developers reported challenges with the increased operational overhead.`,
        "response": {
            "tags": [
                "#microservices",
                "#devops",
                "#team-management",
            ],
            "newTags": [
                "#productivity-analysis",
                "#architecture-transition",
            ],
        }
    },


    {
        "inputTags": [
            "#nodejs",
            "#debugging",
            "#performance",
            "#web-development",
            "#cloud",
            "#testing",
        ],
        "document": `Debugging Memory Leaks in Node.js Applications

Common causes of memory leaks in Node.js applications and how to identify them:

1. Event listener accumulation
2. Closure memory retention
3. Global variables misuse
4. Stream handling errors

Using Chrome DevTools and heap snapshots for analysis. Includes practical examples and memory profiling techniques.`,
        "response": {
            "tags": [
                "#nodejs",
                "#debugging",
                "#performance",
            ],
            "newTags": [
                "#memory-management",
                "#profiling-tools",
            ],
        }
    },


    {
        "inputTags": [
            "#project-management",
            "#team-collaboration",
            "#api",
            "#scrum",
            "#documentation",
            "#code-review",
        ],
        "document": `March 15, 2024

Sprint retrospective for the API migration project. Team morale is improving after resolving the database bottleneck issues. Key achievements:
- Completed migration of user authentication endpoints
- Reduced latency by 45%
- Implemented new error handling system

Challenges remain with the legacy data transformation. Sarah suggested using a queue system to handle the load, which we'll explore next sprint.

TODO for tomorrow:
- Review PR for data validation
- Schedule architecture review
- Update project timeline`,
        "response": {
            "tags": [
                "#project-management",
                "#team-collaboration",
                "#api",
            ],
            "newTags": [
                "#sprint-retro",
                "#performance-improvements",
            ],
        }
    },


    {
        "inputTags": [
            "#machine-learning",
            "#research",
            "#data-science",
            "#big-data",
            "#statistics",
            "#predictive-modeling",
            "#AI",
        ],
        "document": `April 3, 2024

Experiment ID: ML-478
Model Training Results - Day 3

Training metrics show unexpected behavior in the validation loss. The loss curve started oscillating after epoch 150, possibly indicating:
1. Learning rate might be too high
2. Potential data leakage between train/val sets

Modified hyperparameters:
- Reduced learning rate to 0.0001
- Increased batch size to 64
- Added gradient clipping

Next steps: Run overnight training with new parameters. Check for data preprocessing inconsistencies.`,
        "response": {
            "tags": [
                "#machine-learning",
                "#research",
                "#data-science",
            ],
            "newTags": [
                "#experiment-log",
                "#model-training",
            ],
        }
    },


    {
        "inputTags": [
            "#learning",
            "#react",
            "#frontend",
            "#javascript",
            "#web-design",
            "#coding",
        ],
        "document": `June 8, 2024

Today's learning focus was on React hooks and context API. Spent 3 hours working through the advanced patterns course. Finally understood why useCallback is crucial for performance optimization.

Key insights:
- Memo vs useMemo differences
- Context performance pitfalls
- Custom hooks best practices

Struggled with understanding the reducer pattern initially, but the official docs examples helped clear things up.

Goals for tomorrow: Build a small demo implementing these patterns in my side project.`,
        "response": {
            "tags": [
                "#learning",
                "#react",
                "#frontend",
            ],
            "newTags": [
                "#study-notes",
                "#personal-growth",
            ],
        }
    },


    {
        "inputTags": [
            "#self-reflection",
            "#personal-growth",
            "#relationships",
            "#journaling",
            "#psychology",
            "#goal-setting",
        ],
        "document": `April 15, 2024

Today I realized something important about my tendency to overthink decisions. While having coffee with Sarah, she mentioned how quickly I shut down the idea of applying for that art workshop. My immediate response was to list all the reasons why it wouldn't work - time, money, my supposed lack of talent.

But sitting here now, I recognize this pattern. It's the same one that kept me from trying photography last year. I'm not afraid of failing as much as I'm afraid of being seen trying. There's a vulnerability in beginning something new, in being a novice.

Maybe this resistance is telling me exactly why I need to do this. I've spent so many years in my comfort zone that it's become less of a comfort and more of a cage.

Question to reflect on: What would I do if I knew no one was watching or judging?`,
        "response": {
            "tags": [
                "#self-reflection",
                "#personal-growth",
                "#relationships",
            ],
            "newTags": [
                "#fear-exploration",
                "#comfort-zone",
            ],
        }
    },


    {
        "inputTags": [
            "#family",
            "#grief",
            "#memories",
            "#emotional-health",
            "#life-stages",
            "#support-systems",
        ],
        "document": `July 8, 2024

The house feels different now that Mom has moved to assisted living. I spent the afternoon going through old photo albums in what used to be her crafting room. Found pictures from that summer vacation in Maine - all of us squeezed into that tiny rental cabin, laughing about Dad's failed attempts at fishing.

The grief comes in waves. Sometimes it's not even sadness, just a hollow feeling when I realize I can't call her for our usual Sunday chats about her garden. The nurses say she's adjusting well, but it's hard to reconcile the vibrant woman in these photos with someone who now struggles to remember my name.

I keep telling myself this is the right decision, but the guilt lingers. Time feels so precious now, and I'm learning that being a good daughter sometimes means making impossible choices.

Gratitude moment: Found a handwritten recipe card in her cookbook - her famous apple pie. Her handwriting is like a time capsule.`,
        "response": {
            "tags": [
                "#family",
                "#grief",
                "#memories",
            ],
            "newTags": [
                "#life-transitions",
                "#caregiver-journey",
            ],
        }
    },


    {
        "inputTags": [
            "#mindfulness",
            "#mental-health",
            "#nature",
            "#well-being",
            "#outdoor-activities",
            "#health",
        ],
        "document": `May 21, 2024

Spent sunrise at the beach today. No phone, no book, just presence. The sky shifted through so many shades of pink I never knew existed. Watched an elderly couple walking their dog - they moved slowly, in perfect sync, stopping whenever their golden retriever found something interesting to sniff.

I've been rushing through life lately, always three steps ahead of the present moment. But today, for just an hour, time felt different. Noticed how the sand feels different at the water's edge - more compact, cool against my feet. Even my breathing changed, matching the rhythm of the waves.

Been thinking about what my therapist said about "productive" versus "present." Why is it so hard to believe that sometimes just existing, just observing, is enough?

Note to self: The world doesn't stop being beautiful just because I'm too busy to notice it.`,
        "response": {
            "tags": [
                "#mindfulness",
                "#mental-health",
                "#nature",
            ],
            "newTags": [
                "#presence-practice",
                "#sensory-awareness",
            ],
        }
    },


    {
        "inputTags": [
            "#psychology",
            "#neuroscience",
            "#study-notes",
            "#cognitive-science",
            "#behavioral-science",
            "#learning-theory",
        ],
        "document": `PSY 301: Cognitive Psychology
Date: March 15, 2024
Topic: Memory Formation & Retrieval

I. Types of Memory
A. Sensory Memory
   - Duration: < 1 second
   - Examples: visual (iconic), auditory (echoic)
   - Functions as initial filter for attention

B. Short-term Memory (Working Memory)
   - Duration: 20-30 seconds
   - Capacity: 7 ± 2 items
   - Can be extended through chunking

C. Long-term Memory
   - Potentially unlimited capacity
   - Requires consolidation
   - Types: explicit (declarative) vs. implicit (procedural)

Key Study: Peterson & Peterson (1959)
- Demonstrated rapid decay of short-term memory
- Method: Participants remembered trigrams while counting backward
- Results: 90% forgetting after 18 seconds

Questions for exam:
* How does stress affect memory consolidation?
* Difference between retrograde and anterograde amnesia
* Role of hippocampus in memory formation`,
        "response": {
            "tags": [
                "#psychology",
                "#neuroscience",
                "#study-notes",
            ],
            "newTags": [
                "#memory-systems",
                "#exam-prep",
            ],
        }
    },


    {
        "inputTags": [
            "#environmental-science",
            "#lab-notes",
            "#data-collection",
            "#research",
            "#climate-change",
            "#ecology",
        ],
        "document": `ENV 220: Climate Systems
Lab Session: Atmospheric CO2 Analysis
Date: May 8, 2024

Equipment Used:
- Gas chromatograph
- Air sampling containers
- Data logging software
- Temperature probes

Methodology:
1. Collected air samples from 3 locations:
   * Urban center (downtown)
   * Suburban park
   * Industrial zone
2. Measured CO2 concentrations at different times:
   - Morning (7am)
   - Noon
   - Evening (6pm)

Results:
Location      AM    Noon    PM
Downtown     415    422    428
Park         402    408    411
Industrial   425    431    436
(All values in ppm)

Observations:
* Highest concentrations in industrial zone
* All locations show daily variation pattern
* Temperature correlation noted
* Urban heat island effect visible in data

Error Sources:
- Wind direction variations
- Temperature fluctuations
- Equipment calibration
- Human error in collection

Questions for Lab Report:
1. Explain daily CO2 concentration patterns
2. Compare results with global averages
3. Discuss impact of local factors`,
        "response": {
            "tags": [
                "#environmental-science",
                "#lab-notes",
                "#data-collection",
                "#research",
            ],
            "newTags": [
                "#field-measurements",
                "#urban-environment",
            ],
        }
    },
]
