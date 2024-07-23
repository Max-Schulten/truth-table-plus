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
    contentEl.createEl('h2', { text: 'Enter logical expression' });

    new Setting(contentEl)
      .setName('Expression')
      .addText((text) =>
        text.onChange((value) => {
          this.result = value;
        })
      );
    
    new Setting(contentEl)
      .setName('Variables')
      .addText((text) => text.onChange((value) => {
        this.vars = Array.from(value)
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
