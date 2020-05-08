import { MarkdownTable } from './docs-util';
export const slotsToMarkdown = (slots) => {
    const content = [];
    if (slots.length === 0) {
        return content;
    }
    content.push(`## Slots`);
    content.push(``);
    const table = new MarkdownTable();
    table.addHeader(['Slot', 'Description']);
    slots.forEach(style => {
        table.addRow([style.name === '' ? '' : `\`"${style.name}"\``, style.docs]);
    });
    content.push(...table.toMarkdown());
    content.push(``);
    content.push(``);
    return content;
};
