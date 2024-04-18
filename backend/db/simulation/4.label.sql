  DROP TABLE IF EXISTS label;

  CREATE TABLE If NOT EXISTS label (
    group_id integer NOT NULL,
    label_name varchar NOT NULL,
    label_color varchar NOT NULL,
    PRIMARY KEY (group_id, label_name),
    FOREIGN KEY (group_id) REFERENCES care_group (group_id)
);

  CREATE TABLE If NOT EXISTS task_labels (
    task_id integer NOT NULL,
    group_id integer NOT NULL,
    label_name varchar NOT NULL,
    PRIMARY KEY (task_id, label_name),
    FOREIGN KEY (task_id) REFERENCES task (task_id) ON UPDATE CASCADE,
    FOREIGN KEY (group_id, label_name) REFERENCES label (group_id, label_name) ON UPDATE CASCADE
);

INSERT INTO label (group_id, label_name, label_color)
VALUES
  (5, 'Financial', 'orange'),
  (5, 'Appointments', 'green'),
  (5, 'Medication', 'red')
;

INSERT INTO task_labels (task_id, group_id, label_name)
VALUES
  (1, 5, 'Financial'),
  (2, 5, 'Appointments'),
  (3, 5, 'Medication'),
  (4, 5, 'Financial'),
  (5, 5, 'Appointments'),
  (6, 5, 'Financial'),
  (7, 5, 'Appointments')
;