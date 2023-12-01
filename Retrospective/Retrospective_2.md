SEII_Main-Project RETROSPECTIVE (Demo 1)
=====================================

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done: 4 vs. 4
- Total points committed vs. done: 19 vs. 19
- Nr of hours planned vs. spent (as a team): 112h vs. 114h 25m

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed


### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    18   |        |    66h     |   69h 40m    |
| _#1_   |    4    |   3    |    9h      |   9h 15m     |
| _#2_   |    4    |   3    |    11h     |   10h 45m    |
| _#3_   |    4    |   5    |    8h      |   8h 15m     |
| _#4_   |    5    |   8    |    17h     |   16h 30m    |


- Hours per task average, standard deviation (estimate and actual): estimate task average: 3.2, actual task average: 3.26, standard deviation estimate: 0.47, standard deviation actual: 0.48
- Total task estimation error ratio: sum of total hours estimation / (sum of total hours spent - 1): 0.02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 9h
  - Total hours spent: 9h
  - Nr of automated unit test cases: 59
  - Coverage (if available): 70%
- E2E testing:
  - Total hours estimated: 3h
  - Total hours spent: 2h 10m
- Code review 
  - Total hours estimated: 5h
  - Total hours spent: 4h 30m
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
  - This time, our estimation phase showed an improvement, leading to a narrower gap between the estimated and actual time taken for most tasks. However, we did encounter an issue with underestimating the required recovery time from the previous sprint for the automated integration tests.

- What lessons did you learn (both positive and negative) in this sprint? 
  - We improved our knowledge about docker and SAML authentication learning how important is to follow the product owner's requirements but the negative side was about preparing the environment for the integration testing due to the technology we chose.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - We improved in the team division of tasks as well as we had better communication thanks to scrum meetings which was our problem in the last sprint. We had also a good management between front-end branches and back-end ones as our predetermined goal from last sprint.
  
- Which ones you were not able to achieve? Why? 
  - We were not able to implement the automated end-to-end tests because we underestimated the learning task about that. In fact we spent more time achieving the horizontal tasks needed for this sprint which has delayed us due to the learning of new technologies as Docker or SAML.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.) :

  > 1. implementing automated tests for the remaining stories that still require testing
  > 2. complete learning of Sonarcloud
  > 3. Refactoring of or code

- One thing you are proud of as a Team: 
  - We got a good estimation error after this analysis thanks to improvement in our communication during the planning and we are proud of our achieved deadlines for the horizontal tasks
