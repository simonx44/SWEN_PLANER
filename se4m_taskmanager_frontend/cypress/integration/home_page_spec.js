import createResponse from "../fixtures/createTaskResponse.json";
import deleteResponse from "../fixtures/DeleteTask.json";
import createSubTaskResponse from "../fixtures/createSubtask.json";

describe("The Home Page", () => {
    beforeEach("Backend laden", () => {
        cy.intercept("POST", "**/auth/*", { statusCode: 200 }).as("Login");
        cy.intercept("GET", "**/tasks", { fixture: "response_1.json" }).as("initial");
        cy.intercept("GET", "**/lists", { fixture: "response_list.json" }).as("initial1");
        cy.intercept("GET", "**/tasks?status=CLOSED", { fixture: "response_closed_tasks.json" }).as("initial2");
        cy.intercept("GET", "**/tasks?status=OPEN", { fixture: "response_open_tasks.json" }).as("initial3");
        cy.intercept("GET", "**/tasks?listId**", { fixture: "response_list_liste1.json" }).as("initial4");
        cy.visit("http://localhost:3000/");
        cy.get("#username").clear();
        cy.get("#username").type("test");
        cy.get("#password > .p-inputtext").clear();
        cy.get("#password > .p-inputtext").type("test").type("{enter}");
        cy.wait("@initial");
        cy.wait("@initial1");
    });

    context("LoadPage", () => {
        it("succesfully loads Tasks", () => {
            cy.contains("Aufgabe 1");
        });
    });

    context("ShowDetails", () => {
        it("Show More Details", () => {
            cy.contains("More Details").click();
            cy.contains("Details").should("exist");
            cy.contains("Edit").should("exist");
            cy.contains("Delete").should("exist");
            cy.get(".p-dialog-header-icon").click();
        });
    });

    context("DeleteTask", () => {
        it("Delete Task with Click More Details and button delete", () => {
            cy.intercept("DELETE", "**/tasks/*", { body: deleteResponse, statusCode: 202 }).as("DeleteTask");
            cy.contains("More Details").click();
            cy.contains("Delete").click();
            cy.wait("@DeleteTask");
        });

        it("Delete Task with Click card action and delete", () => {
            cy.intercept("DELETE", "**/tasks/*", { body: deleteResponse, statusCode: 202 }).as("DeleteTask1");
            cy.get(":nth-child(1) > .p-card > .p-card-body > .p-card-content > .justify-content-start > .tp-card__action").click();
            cy.contains("Delete").click();
            cy.wait("@DeleteTask1");
        });
    });

    context("AddTask", () => {
        it("Add new task", () => {
            cy.intercept("POST", "**/tasks", { body: createResponse, statusCode: 202 }).as("CreateTask");
            cy.contains("Add new task").click();
            cy.get("#title").type("Test Aufgabe");
            cy.get("#description").type("Aufgabe erstellt mit Cypress");
            cy.contains("Create Task").click();
            cy.wait("@CreateTask");
        });
    });

    context("CompleteTask", () => {
        it("complete task", () => {
            cy.intercept("PATCH", "**/tasks/*", { statusCode: 204 }).as("PatchTask");
            cy.get(":nth-child(1) > .p-card > .p-card-body > .p-card-content > :nth-child(4) > .col-2 > .p-checkbox > .p-checkbox-box").click();
            cy.wait("@PatchTask");
        });
    });

    context("PatchTask", () => {
        it("Patch task", () => {
            cy.intercept("PATCH", "**/tasks/*", { statusCode: 204 }).as("PatchTask");
            cy.get(":nth-child(1) > .p-card > .p-card-body > .p-card-content > .justify-content-start > .tp-card__action").click();
            cy.get(".tp-popover > :nth-child(2)").click();
            cy.get("#title").clear();
            cy.get("#title").type("Task Cypress");
            cy.get("#description").clear();
            cy.get("#description").type("Testing with Cypress");
            cy.get("#priority > .p-dropdown-trigger").click();
            cy.get("[aria-label=\"MEDIUM\"]").click();
            cy.get("#plannedEffort").clear();
            cy.get("#plannedEffort").type("00:10");
            cy.get(".p-button.field").click();
            cy.wait("@PatchTask");
        });
    });

    context("AddSubTask", () => {
        it("Add new Subtask", () => {
            cy.intercept("POST", "**/tasks/**", { body: createSubTaskResponse, statusCode: 202 }).as("CreateSubTask");
            cy.get(":nth-child(6) > .p-card > .p-card-body > .p-card-content > .p-card-footer > :nth-child(1)").click();
            cy.get("#pr_id_7_header_1").click();
            cy.get(".p-datatable-tbody").children().should("have.length", 3);
            cy.get(":nth-child(1) > .flex > .p-button").click();
            cy.get("#subTaskTitle").type("Test Unteraufgabe");
            cy.get("#subTaskDescription").type("Aufgabe erstellt mit Cypress");
            cy.contains("Create subtask").click();
            cy.wait("@CreateSubTask");
            cy.get(".p-datatable-tbody").children().should("have.length", 4);
        });
    });

    context("DeleteSubTask", () => {
        it("Delete SubTask", () => {
            cy.intercept("DELETE", "**/tasks/**", { body: deleteResponse, statusCode: 204 }).as("DeleteSubTask");
            cy.get(":nth-child(6) > .p-card > .p-card-body > .p-card-content > .p-card-footer > :nth-child(1)").click();
            cy.get("#pr_id_7_header_1").click();
            cy.get(".p-datatable-tbody").children().should("have.length", 3);
            cy.get(".p-row-odd > [style=\"width: 10px;\"] > .pi").click();
            cy.wait("@DeleteSubTask");
            cy.get(".p-datatable-tbody").children().should("have.length", 2);
        });
    });

    context("CompleteSubTask", () => {
        it("complete SubTask", () => {
            cy.intercept("PATCH", "**/tasks/**", { statusCode: 204 }).as("PatchSubTask");
            cy.get(":nth-child(6) > .p-card > .p-card-body > .p-card-content > .p-card-footer > :nth-child(1)").click();
            cy.get("#pr_id_7_header_1").click();
            cy.get(".p-row-odd > :nth-child(3) > .p-checkbox > .p-checkbox-box").click();
            cy.wait("@PatchSubTask");
        });
    });

    context("ShowSubTask", () => {
        it("ShowSubTask", () => {
            cy.get(":nth-child(6) > .p-card > .p-card-body > .p-card-content > .p-card-footer > :nth-child(1)").click();
            cy.get("#pr_id_7_header_1").click();
        });
    });

    context("PatchSubTask", () => {
        it("PatchSubTask", () => {
            cy.intercept("PATCH", "**/tasks/**", { statusCode: 204 }).as("PatchSubTask");
            cy.get(":nth-child(6) > .p-card > .p-card-body > .p-card-content > .p-card-footer > :nth-child(1)").click();
            cy.get("#pr_id_7_header_1").click();
            cy.get(".p-row-odd > [style=\"text-align: end;\"] > .p-row-editor-init").click();
            cy.get(".p-row-odd > :nth-child(1) > .p-inputtext").clear();
            cy.get(".p-row-odd > :nth-child(1) > .p-inputtext").type("Test Cypress");
            cy.get(":nth-child(2) > .p-inputtext").clear();
            cy.get(":nth-child(2) > .p-inputtext").type("Testing with Cypress");
            cy.get(".p-dropdown-trigger").click();
            cy.get("[aria-label=\"CLOSED\"]").click();
            cy.get(".p-row-editor-save").click();
            cy.wait("@PatchSubTask");
            cy.contains("Test Cypress").should("exist");
        });
    });

    context("Navigation bar", () => {
        it("Show and hide navigation bar", () => {
            cy.get(".sidebar").should("be.visible");
            cy.get(".topbar__brand__toggle > .pi").click();
            cy.get(".sidebar").should("not.visible");
        });
    });

    context("AddList", () => {
        it("Add new list", () => {
            cy.intercept("POST", "**/lists", { body: createResponse, statusCode: 201 }).as("AddList");
            cy.get(".sidebar__lists__content").children().should("have.length", 4);
            cy.contains("Add list").click();
            cy.get("#title").type("Test Liste");
            cy.get("#description").type("Liste erstellt mit Cypress");
            cy.contains("Create List").click();
            cy.wait("@AddList");
            cy.get(".sidebar__lists__content").children().should("have.length", 5);
        });
    });

    context("DeleteList", () => {
        it("Delete List", () => {
            cy.intercept("DELETE", "**/lists/*", { body: deleteResponse, statusCode: 202 }).as("DeleteList");
            cy.get(".sidebar__lists__content").children().should("have.length", 4);
            cy.get(":nth-child(4) > .pi").click();
            cy.get(".p-confirm-dialog-accept").click();
            cy.get(".p-confirm-dialog-accept").click();
            cy.wait("@DeleteList");
            cy.get(".sidebar__lists__content").children().should("have.length", 3);
        });
    });

    context("PatchList", () => {
        it("Patch List", () => {
            cy.intercept("PATCH", "**/lists/*", { statusCode: 202 }).as("PatchList");
            cy.contains("Liste").click();
            cy.contains("Modify list").click();
            cy.get("#title").clear();
            cy.get("#title").type("List Cypress");
            cy.get("#description").clear();
            cy.get("#description").type("Testing with Cypress");
            cy.get(".p-fluid > .p-button").click();
            cy.wait("@PatchList");
            cy.contains("List Cypress").should("exist");
        });
    });

    context("AddTaskToList", () => {
        it("Add new task to list", () => {
            cy.intercept("POST", "**/tasks", { body: createResponse, statusCode: 202 }).as("AddTaskToList");
            cy.contains("Liste").click();
            cy.contains("Add new task").click();
            cy.get("#title").type("Test Aufgabe");
            cy.get("#description").type("Aufgabe erstellt mit Cypress");
            cy.get("#listId").type("Liste");
            cy.contains("Create Task").click();
            cy.wait("@AddTaskToList");
        });
    });
});

describe("User Management", () => {
    beforeEach("Backend laden", () => {
        cy.visit("http://localhost:3000/");
    });

    context("LoadLoginPage", () => {
        it("succesfully loads LoginPage", () => {
            cy.contains("Login");
        });
    });

    context("Login", () => {
        it("succesfully loggedin", () => {
            cy.intercept("POST", "**/auth/*", { statusCode: 200 }).as("Login");
            cy.intercept("GET", "**/tasks", { fixture: "response_1.json" }).as("initial");
            cy.intercept("GET", "**/lists", { fixture: "response_list.json" }).as("initial1");
            cy.get("#username").clear();
            cy.get("#username").type("test");
            cy.get("#password > .p-inputtext").clear();
            cy.get("#password > .p-inputtext").type("test").type("{enter}");
            cy.wait("@initial");
            cy.wait("@initial1");
        });
    });

    context("Logout", () => {
        it("succesfully loggedout", () => {
            cy.intercept("POST", "**/auth/*", { statusCode: 200 }).as("Login");
            cy.intercept("GET", "**/tasks", { fixture: "response_1.json" }).as("initial");
            cy.intercept("GET", "**/lists", { fixture: "response_list.json" }).as("initial1");
            cy.get("#username").clear();
            cy.get("#username").type("test");
            cy.get("#password > .p-inputtext").clear();
            cy.get("#password > .p-inputtext").type("test").type("{enter}");
            cy.wait("@initial");
            cy.wait("@initial1");
            cy.get(".pi-power-off").click();
        });
    });

    context("Signup", () => {
        it("succesfully signedup", () => {
            cy.intercept("POST", "**/auth/register", { statusCode: 202 }).as("Register");
            cy.intercept("POST", "**/auth/login", { statusCode: 200 }).as("Login");
            cy.intercept("GET", "**/tasks", { fixture: "response_1.json" }).as("initial");
            cy.intercept("GET", "**/lists", { fixture: "response_list.json" }).as("initial1");
            cy.contains("Sign up instead").click();
            cy.get("#username").clear();
            cy.get("#username").type("Cypresstest");
            cy.get("#name").clear();
            cy.get("#name").type("Cypresstest");
            cy.get("#password > .p-inputtext").clear();
            cy.get("#password > .p-inputtext").type("test").type("{enter}");
            cy.wait("@Register");
            cy.wait("@Login");
            cy.wait("@initial");
            cy.wait("@initial1");
        });
    });

    context("Login + session expired", () => {
        it("loggedin + Add Task + session expired 403", () => {
            cy.intercept("POST", "**/auth/*", { statusCode: 200 }).as("Login");
            cy.intercept("GET", "**/tasks", { fixture: "response_1.json" }).as("initial");
            cy.intercept("GET", "**/lists", { fixture: "response_list.json" }).as("initial1");
            cy.intercept("POST", "**/tasks", { body: createResponse, statusCode: 202 }).as("CreateTask");
            cy.intercept("GET", "**/tasks?status=OPEN", { fixture: "response_open_tasks.json" }).as("initial3");
            cy.get("#username").clear();
            cy.get("#username").type("test");
            cy.get("#password > .p-inputtext").clear();
            cy.get("#password > .p-inputtext").type("test").type("{enter}");
            cy.wait("@initial");
            cy.wait("@initial1");
            cy.contains("Add new task").click();
            cy.get("#title").type("Test Aufgabe");
            cy.get("#description").type("Aufgabe erstellt mit Cypress");
            cy.contains("Create Task").click();
            cy.wait("@CreateTask");
            cy.intercept("GET", "**/tasks*", { statusCode: 403 }).as("Login1");
            cy.get(".sidebar__routes > :nth-child(4)").click();
        });

        it("loggedin + Add Task + session expired 401", () => {
            cy.intercept("POST", "**/auth/*", { statusCode: 200 }).as("Login");
            cy.intercept("GET", "**/tasks", { fixture: "response_1.json" }).as("initial");
            cy.intercept("GET", "**/lists", { fixture: "response_list.json" }).as("initial1");
            cy.intercept("POST", "**/tasks", { body: createResponse, statusCode: 202 }).as("CreateTask");
            cy.intercept("GET", "**/tasks?status=OPEN", { fixture: "response_open_tasks.json" }).as("initial3");
            cy.get("#username").clear();
            cy.get("#username").type("test");
            cy.get("#password > .p-inputtext").clear();
            cy.get("#password > .p-inputtext").type("test").type("{enter}");
            cy.wait("@initial");
            cy.wait("@initial1");
            cy.contains("Add new task").click();
            cy.get("#title").type("Test Aufgabe");
            cy.get("#description").type("Aufgabe erstellt mit Cypress");
            cy.contains("Create Task").click();
            cy.wait("@CreateTask");
            cy.intercept("GET", "**/tasks*", { statusCode: 401 }).as("Login1");
            cy.get(".sidebar__routes > :nth-child(4)").click();
        });
    });
});
