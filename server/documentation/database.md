# DATABASE CONFIGURATION
## **TABLES**
###  *Application*
- id integer ***primary key***
- id_student integer ***not null*** ***foreign key***
- id_thesis integer ***not null*** ***foreign key***
- id_teacher integer ***not null*** ***foreign key***
- data string 
    - format: YYYY-MM-DD
- path_cv string
    - where on file system is saved
- status integer ***not null***
    - say if the application is in a state of:
        - pending: 0
        - accepted: 1
        - rejected: 2
    
### *Career*
- id integer ***primary key***
- cod_course integer ***not null***
- title_course integer ***not null***
- cfu integer ***not null***
- grade integer ***not null***
    - it has to be greater equal 18 and lower or equal 31
        - 31 is equal to 30L
- date string ***not null***
    - format: YYYY-MM-DD

### *CoSupervisor*
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- company string

### *CoSupervisorThesis*
- id integer ***primary key***
- id_teacher integer ***not null*** ***foreign key***
- id_thesis integer ***not null*** ***foreign key***

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
- cod_degree integer ***not null*** ***foreign key***
- enrol_year integr ***not null***

### *Teacher*
- id integer ***primary key***
- email string ***unique***
- name string
- surname string
- code_group integer ***not null***
- code_dep integer ***not null***

### *Thesis*
    replication are permitted
- id integer ***primary key***
- title string
- supervisor integer ***not null*** ***foreign key (Theacher_id)***
- keywords string
- type string ***not null***
- groups string ***not null***
- description string
- knowledge string
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