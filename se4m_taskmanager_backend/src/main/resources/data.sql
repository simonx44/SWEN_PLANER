
INSERT INTO TASK (ID, ASSIGNED_USER, Due_Day, Planned_Effort, PRIORITY, TASK_DESCRIPTION, TASK_TITLE,STATUS )
VALUES ('efbfbd37-4926-08ef-bfbd-4a7aefbfbd19', '133e253d-2086-416b-afd1-3e8abf305636', '2015-06-24', 1 , 0,
        'Beschreibung', 'Aufgabe 3',0);


INSERT INTO TASK (ID, ASSIGNED_USER, Due_Day, Planned_Effort, PRIORITY, TASK_DESCRIPTION, TASK_TITLE,STATUS )
VALUES ('efbfbd57-4926-08ef-bfbd-4a7aefbfbd17', '133e253d-2086-416b-afd1-3e8abf305636', '2015-06-24', 1 , 0,
        'Beschreibung', 'Aufgabe 1',0);


INSERT INTO TASK (ID, ASSIGNED_USER, Due_Day, Planned_Effort, PRIORITY, TASK_DESCRIPTION, TASK_TITLE,STATUS )
VALUES ('efbfbd47-4926-08ef-bfbd-4a7aefbfbd16', '133e253d-2086-416b-afd1-3e8abf305636', '2015-06-24', 1 , 0,
        'Beschreibung', 'Aufgabe 2',0);


INSERT INTO TASK (ID, ASSIGNED_USER, Due_Day, Planned_Effort, PRIORITY, TASK_DESCRIPTION, TASK_TITLE,STATUS )
VALUES ('efbfbd37-4926-08ef-bfbd-4a7aefbfbd15', '133e253d-2086-416b-afd1-3e8abf305636', '2015-06-24', 1 , 0,
        'Beschreibung', 'Aufgabe 4',0);

INSERT INTO SUBTASK (SUBTASK_DESCRIPTION, ID, SUBTASK_TITLE, TASK_FK, STATUS )
VALUES ('SUB task 1', 'ae68affb-c366-40a2-8292-350e55522658', 'Sub task 1',
        'efbfbd37-4926-08ef-bfbd-4a7aefbfbd15',0);


INSERT INTO SUBTASK (SUBTASK_DESCRIPTION, ID, SUBTASK_TITLE, TASK_FK, STATUS )
VALUES ('SUB task 2', '9f6bf950-b818-4e5f-8c00-ae5e4cb17737', 'Sub task 2',
        'efbfbd37-4926-08ef-bfbd-4a7aefbfbd15',0);



INSERT INTO SUBTASK (SUBTASK_DESCRIPTION, ID, SUBTASK_TITLE, TASK_FK, STATUS )
VALUES ('SUB task 2', '44ad3bcd-7220-4843-9ece-b377d040de25', 'Sub task 3',
        'efbfbd37-4926-08ef-bfbd-4a7aefbfbd15',0);



INSERT INTO SUBTASK (SUBTASK_DESCRIPTION, ID, SUBTASK_TITLE, TASK_FK, STATUS )
VALUES ('Beliebige Beschreibung', '85412a08-9f73-4fe5-a4ea-7ce920db6c78', 'Test SubTask',
        'efbfbd37-4926-08ef-bfbd-4a7aefbfbd19',0);






