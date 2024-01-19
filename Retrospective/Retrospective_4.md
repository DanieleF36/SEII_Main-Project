TEMPLATE FOR RETROSPECTIVE (Demo 4)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 7 vs 7
- Total points committed vs done: 26 vs 26
- Nr of hours planned vs spent (as a team): 110.5h vs 108h 45m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   13    |    -   |    51h 30m |   50h 20m    |
| _#14_  |    4    |    3   |    5h      |     5h       |
| _#15_  |    4    |    3   |    8h      |    7h 10m    |
| _#16_  |    4    |    3   |    9h 30m  |    9h 30m    |
| _#26_  |    4    |    8   |    11h     |    10h       |
| _#27_  |    4    |    3   |    7h 30m  |    7h 45m    |
| _#28_  |    4    |    3   |    9h      |    9h 30m    |
| _#29_  |    4    |    3   |    9h      |    9h 30m    |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - estimate task average: 2.69
  - actual task average: 2.65
  - standard deviation estimate: 2.89
  - standard deviation actual: 3.40
- Total task estimation error ratio: 1- (sum of total hours estimation / (sum of total hours spent )): 0.016

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 17h 
  - Total hours spent: 16h 15m
  - Nr of automated unit test cases: 351 + 56 (integration)
  - Coverage (if available): 85.0%
- E2E testing:
  - Total hours estimated: 2h
  - Total hours spent: 2h
- Code review 
  - Total hours estimated: 7h 30m 
  - Total hours spent: 7h 30m
- Technical Debt Management:
  - Total hours estimated: 2h
  - Total hours spent: 2h
  - Hours estimated for remediation by SonarQube:  6h 17m 
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 2h
  - Hours spent on remediation: 2h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.4% -> 0.4%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability): 
    - Reliability: _A_
    - Maintainability: _A_
    - Security: _A_
    - Security Review: _A_
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - This sprint we overstimate the tasks because last time we have done a refactoring of all the code and now it is much better and easier to implement and modify already existing features.

- What lessons did you learn (both positive and negative) in this sprint?
  - We learned that if the code is clean and extensible it's easier to implement the new features and modify the codebase. A negative aspect is that remote communication can cause misunderstanding between the team members.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We separately assigned the SonarCloud's tasks which caused to better performance. We have been very careful about the FAQ review checking for new messages on telegram chat continuosly
  
- Which ones you were not able to achieve? Why?
  - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - We can icrease the number of stories because this time we overstimate the tasks.
  - We should improve online communication in case of most of us work remotely. 

- One thing you are proud of as a Team
  - We are proud of our final web application which works smoothly and our group work.