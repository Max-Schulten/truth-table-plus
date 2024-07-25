import { App, Modal, Setting } from 'obsidian';

export class InputModal extends Modal {
  result: string;
  vars: string[];
  onSubmit: (result: string, vars: string[]) => void;

  constructor(app: App, onSubmit: (result: string, vars: string[]) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Enter logical expression & variables:' });

    new Setting(contentEl)
      .setName('Expression')
      .setDesc('Please use JS logic symbols: && = and, || = or, ! = negation. (ex. !a&&b||c)')
      .addText((text) =>
        text.onChange((value) => {
          this.result = value;
        })
      );
    
    new Setting(contentEl)
      .setName('Variables')
      .setDesc('Please enter all variables used above in a comma seperated list. (ex. a,b,c)')
      .addText((text) => text.onChange((value) => {
        const arr = []
        value = value.replace(/,|\s/g, '')
        for(const x of value) {
          arr.push(x)
        }
        this.vars = arr
      })
    )

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Submit')
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result, this.vars);
          })
      );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
