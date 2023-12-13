# DATABASE CONFIGURATION
## **TABLES**
###  *Application*
    This table represents the application of student at one thesis, with all the information needed
- id integer ***primary key***
- id_student integer ***not null***, ***foreign key***
- id_thesis integer ***not null***, ***foreign key***
    - is added to simplify queries
- id_teacher integer ***not null***, ***foreign key***
- data string 
    - format: YYYY-MM-DD
- path_cv string
    - where on file system is saved
- status integer ***not null***
    - say if the application is in a state of:
        - pending: 0
        - accepted: 1
        - rejected: 2
        - cancelled: 3
    
### *Career*
    This table represents one passed exem for that student
- id integer ***primary key***
- id_student integer ***foreign key***
- cod_course integer ***not null***
- title_course integer ***not null***
- cfu integer ***not null***
- grade integer ***not null***
    - it has to be greater equal 18 and lower or equal 31
        - 31 is equal to 30L
- date string ***not null***
    - format: YYYY-MM-DD

### *CoSupervisor*
    This table represents all external cosupervisors
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- company string

### *CoSupervisorThesis*
    This table represents the relationship between thesis and cosupervisor.
    One between id_cosupervisor and id_teacher has to be null because one row of this table rapresent one co-supervisor for that thesis, so if id_teacher is not null means that co supervisor is internal, in the other case is external
- id integer ***primary key***
- id_thesis integer ***not null***, ***foreign key***
- id_cosupervisor integer ***foreign key***
- id_teacher integer ***foreign key***

### *Degree*
- cod integer ***primary key***
- title string ***not null***

### *Student*
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- gender integr
    - male: 0
    - female: 1
- nationality string
- cod_degree integer ***not null***, ***foreign key***
- enrol_year integr ***not null***

### *Teacher*
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- code_group integer ***not null***
- code_dep integer ***not null***

### *Thesis*
    Replication are permitted
    This table represents thesis proposals 
- id integer ***primary key***
- title string
- supervisor integer ***not null***, ***foreign key(teacher.id)***
- keywords array of strings
- type array of strings ***not null***
- groups array of strings ***not null***
- description string
- knowledge array of strings
- note string
- expiration_date string ***not null***
    - format: YYYY-MM-DD
- level integer ***not null***
    - Bachelor: 0
    - Master: 1
- cds string ***not null***
- creation_date string
    - format: YYYY-MM-DD
- status integer ***not null***
    - Archived: 0
    - Public: 1