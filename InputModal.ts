import { App, Modal, Setting } from 'obsidian';

export class InputModal extends Modal {
  result: string;
  onSubmit: (result: string) => void;

  constructor(app: App, onSubmit: (result: string) => void) {
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
      .addButton((btn) =>
        btn
          .setButtonText('Submit')
          .setCta()
          .onClick(() => {
            this.close();
            // Normalizing input now so I don't gotta do it later
            this.onSubmit(this.result.toLowerCase().replace(/\s+/g, ''));
          })
      );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
