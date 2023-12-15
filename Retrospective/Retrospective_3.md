TEMPLATE FOR RETROSPECTIVE (Demo 3)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 4 vs 4
- Total points committed vs done: 19 vs 19
- Nr of hours planned vs spent (as a team): 112h vs 114h 30m

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   14    |    -   |    76h     |   82h 30m    |
| _#10_   |    4    |    5   |    7h      |    6h 50m    |
| _#11_   |    4    |    3   |    7h      |    7h 40m    |
| _#12_   |    4    |    3   |    5h      |    6h        |
| _#13_   |    4    |    8   |    7h      |    7h 30m    |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - estimate task average: 3.73
  - actual task average: 3.81
  - standard deviation estimate: 3.88
  - standard deviation actual: 3.78
- Total task estimation error ratio: sum of total hours estimation / (sum of total hours spent - 1): 0.02

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 5h 
  - Total hours spent: 5h 30m
  - Nr of automated unit test cases: 282 + 56
  - Coverage (if available): 87.2%
- E2E testing:
  - Total hours estimated: 4h
  - Total hours spent: 4h
- Code review 
  - Total hours estimated: 5h  
  - Total hours spent: 5h
- Technical Debt Management:
  - Total hours estimated: 41h (Sonar Estimation + TD team management = 39h + 2h)
  - Total hours spent: 42h  (Sonar Estimation + TD team management = 39h + 3h)
  - Hours estimated for remediation by SonarQube: 39h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 39h
  - Hours spent on remediation: 42h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 1.6% -> 0.4%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability): 
    - Reliability: _C_
    - Maintainability: _A_
    - Security: _A_
    - Security Review: _E_
  


## ASSESSMENT

- What caused your errors in estimation (if any)?
  - We observed that the planning was more precise but the standard deviation has changed moderately since our last analysis due to our choice to accomplish a few tasks shared with many people. 

- What lessons did you learn (both positive and negative) in this sprint?
  - We learned how to do 'well-done' programming according to Sonarcloud guide and this advice let us be more flexible when facing new problems during development.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  - This time WE DID the integration tests to have more coverage, a milestone for us. Furthermore, we learned how to configure Sonarcloud over different branches and we have totally refactored the whole backend which now accomplishes the principles of software engineering.
  
- Which ones you were not able to achieve? Why?
  - None

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> 1. Not assign the Sonarcloud's tasks for all of us based on the topic
> 2. Be careful on the FAQ review

- One thing you are proud of as a Team
  - We are proud of our work on Sonarcloud
