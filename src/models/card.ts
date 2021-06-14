export class PlayCard{
    name :string;
    value :number;
    url :string;
    color :string;
    priority :boolean;

    constructor(name :string, value :number, url :string, color :string, priority :boolean){
        this.name = name;
        this.value = value;
        this.url = url;
        this.color = color;
        this.priority = priority;
    }
}