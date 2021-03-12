import { IComponent } from "@/interfaces/TaskGraphInterface";

interface ITextbox extends IComponent{
    component: {
        header: string;
    },
    dependencies: {
        Textbox: {
            serverOuput: string;
        }
    }
}

export { ITextbox };
