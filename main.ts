import { App, Plugin, MarkdownView, Notice, PluginSettingTab, Setting } from 'obsidian';
import { InputModal } from './InputModal';

interface PluginSettings {
	latex: boolean,
	binary: boolean
}

const DEFAULT_SETTINGS: PluginSettings = {
	latex: true,
	binary: false
}


export default class TruthTablePlugin extends Plugin {
	settings: PluginSettings;


	async onload() {
		await this.loadSettings();
		console.log('Loading Truth Table+');

		// Add a command to generate a truth table
		this.addCommand({
			id: 'generate-truth-table',
			name: 'Generate truth table',
			callback: () => new InputModal(this.app, (exp, vars) => this.createTruthTable(exp, vars)).open(),
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));

	}

	onunload() {
		console.log('Unloading Truth Table+');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	isLetter(s: string): boolean {
		return s.toLowerCase() != s.toUpperCase()
	}

	isValidCase(exp: string, vars: string[]): boolean {
		const validatedIndices = new Map<number, boolean>()
		let openParen = 0
		let closeParen = 0

		for (let i = 0; i < exp.length; i++) {
			if (exp.charAt(i) == '(') {
				openParen++;
			} else if (exp.charAt(i) == ')') {
				closeParen++;
			} else if (validatedIndices.get(i) != true) {
				if (this.isLetter(exp.charAt(i)) && vars.contains(exp.charAt(i))) {
					try {
						if (!this.isLetter(exp.charAt(i + 1))) {
							validatedIndices.set(i, true);
						}
					} catch (error) {
						return false;
					}
				} else if (exp.charAt(i) === "&") {
					try {
						if (exp.charAt(i + 1) === '&') {
							validatedIndices.set(i, true);
							validatedIndices.set(i + 1, true)
						}
					} catch (error) {
						return false;
					}
				} else if (exp.charAt(i) === "|") {
					try {
						if (exp.charAt(i + 1) === '|') {
							validatedIndices.set(i, true);
							validatedIndices.set(i + 1, true)
						}
					} catch (error) {
						return false;
					}
				} else if (exp.charAt(i) === "!") {
					try {
						if (this.isLetter(exp.charAt(i + 1))) {
							validatedIndices.set(i, true);
							validatedIndices.set(i + 1, true)
						} else if (exp.charAt(i + 1) == '(') {
							validatedIndices.set(i, true)
						}
					} catch (error) {
						return false;
					}
				} else { return false }
			}
		}
		if (openParen == closeParen) {
			return true;
		} else { return false }
	}

	createTruthTable(e: string, v: string[]) {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			const editor = activeView.editor
			const truthTable = this.generateTruthTable(e, v);
			editor.replaceSelection(truthTable);
		} else {
			console.error('No active markdown view found')
		}
	}

	allCombinations(num: number): boolean[][] {
		const combinations = [];
		for (let i = 0; i < (1 << num); i++) {
			const combination = [];
			for (let j = num - 1; j >= 0; j--) {
				combination.push((i & (1 << j)) !== 0);
			}
			combinations.push(combination);
		}
		return combinations;
	}

	evaluateTruth(vals: boolean[], expression: string, vars: string[]): boolean {

		let parsed = expression
		for (const char of expression) {
			const i = vars.indexOf(char)
			if (i !== -1) {
				parsed = parsed.replace(char, String(vals[i]))
			}
		}

		return eval(parsed)
	}

	generateTruthTable(expression: string, vars: string[]): string {


		if (this.isValidCase(expression, vars)) {

			const combinations = this.allCombinations(vars.length)

			let table: string;

			if (this.settings.latex == true) {
				let latexExpression = ``

				for (let i = 0; i < expression.length; i++) {
					if (this.isLetter(expression.charAt(i)) || expression.charAt(i) == '(' || expression.charAt(i) == ')') {
						latexExpression = latexExpression + expression.charAt(i)
					} else if (expression.charAt(i) == '&') {
						latexExpression += ' \\wedge '
						i++;
					} else if (expression.charAt(i) == '|') {
						latexExpression += ' \\lor '
						i++
					} else if (expression.charAt(i) == '!') {
						latexExpression += ' \\neg '
					}
				}

				latexExpression = `$` + latexExpression + `$`
				table = `| ${vars.join(' | ')} | ${latexExpression} |\n`
			} else {
				let modifiedExp = ''
				for (const x of expression) {
					if (x == '|') {
						modifiedExp += '\\|'
					} else {
						modifiedExp += x
					}
				}
				table = `| ${vars.join(' | ')} | ${modifiedExp} |\n`
			}

			table += `| ${'-|'.repeat(vars.length)}-|\n`

			for (let i = 0; i < combinations.length; i++) {
				const vals = []
				for (let j = 0; j < vars.length; j++) {
					vals.push(combinations[i][j])
				}
				try {
					const truth = this.evaluateTruth(vals, expression, vars)

					if (this.settings.binary) {
						const numVals = []
						for (const x of vals) {
							numVals.push(Number(x))
						}
						table += `| ${numVals.join(' | ')} | ${Number(truth)} |\n`
					} else {
						const stringVals = []
						for (const x of vals) {
							stringVals.push(String(x).charAt(0).toUpperCase() + String(x).slice(1))
						}
						table += `| ${stringVals.join(' | ')} | ${String(truth).charAt(0).toUpperCase() + String(truth).slice(1)} |\n`
					}
				} catch (error) {
					new Notice('Something went wrong. \n Error: ' + error)
				}
			}
			return table;
		} else {
			new Notice('Your logic expression or variables list was incorrect. Please try again.', 5000)
			return ''
		}
	}

}

class SampleSettingTab extends PluginSettingTab {
	plugin: TruthTablePlugin;

	constructor(app: App, plugin: TruthTablePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h1', { text: 'Truth Table+ settings:' });

		new Setting(containerEl)
			.setName('Use math blocks and symbols for entries and header.')
			.setDesc('When off will use default JS logic symbols (i.e. &&, ||, !).')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.latex === true)
				.onChange(async (value) => {
					this.plugin.settings.latex = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Output true/false values as binary.')
			.setDesc('When on 1 = true, 0 = false.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.binary === true)
				.onChange(async (value) => {
					this.plugin.settings.binary = value;
					await this.plugin.saveSettings();
				}));
	}
}