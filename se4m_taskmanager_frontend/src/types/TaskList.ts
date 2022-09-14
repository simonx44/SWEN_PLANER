export interface TaskList {
    listId: string;
    title: string;
    description: string;
}

export type FilterProps = "listId" | "title" | "description";

export type CreateTaskDTO = {
    title: string;
    description: string;
};

export type ICreateListDTO = {
    title: string;
    description: string;
};
