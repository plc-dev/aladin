const templateString = (template: string, valueObject: { [key: string]: string[] } = {}, concatWith: string = " ") => {
    let output = template;
    Object.entries(valueObject).forEach(([key, values]) => {
        output = output.replace(new RegExp("\\$" + `{${key}}`, "g"), () =>
            values.reduce((string, value, i) => (!i ? value : string + concatWith + value), "")
        );
    });
    return output;
};

const toPascalCase = (string: string) =>
    `${string}`
        .replace(/[-_]+/g, " ")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+(.)(\w+)/g, ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`)
        .replace(/\s/g, "")
        .replace(/\w/, (s) => s.toUpperCase());
export { templateString, toPascalCase };
