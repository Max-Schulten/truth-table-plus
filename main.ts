import { App, Plugin, MarkdownView, Notice, PluginSettingTab, Setting, Editor } from 'obsidian';
import { InputModal } from './InputModal';
import Utils from 'utils';

// Schema for the settings
interface PluginSettings {
	latex: boolean,
	binary: boolean
}

// Setting default values for above
const DEFAULT_SETTINGS: PluginSettings = {
	latex: true,
	binary: false
}


export default class TruthTablePlugin extends Plugin {
	settings: PluginSettings;


	async onload() {
		// Loading previously saved settings
		await this.loadSettings();
		console.log('Loading Truth Table+');

		// Adding a command to generate a truth table
		this.addCommand({
			id: 'generate-truth-table',
			name: 'Generate truth table',
			// Creating a new modal to get expression, runs createTruthTable on submit
			editorCallback: (editor: Editor, view: MarkdownView) => new InputModal(this.app, (exp) => this.createTruthTable(view, exp)).open(),
		});

		// Adds the settings tab
		this.addSettingTab(new SettingTab(this.app, this));

	}

	onunload() {
		console.log('Unloading Truth Table+');
	}

	// Pulls user settings from memory
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	// Puts user settings to memory
	async saveSettings() {
		await this.saveData(this.settings);
	}

	// Will always be called when the modal is submitted
	createTruthTable(activeView: MarkdownView, e: string) {
		// Proceeding only if there is an active view 
		if (activeView) {
			const editor = activeView.editor
			// Generates the actual plain text
			const truthTable = this.generateTruthTable(e, Utils.extractVars(e));
			editor.replaceSelection(truthTable);
		} else {
			console.error('No active markdown view found')
		}
	}


	// Is only ever called by the above
	generateTruthTable(expression: string, vars: string[]): string {

		// Checking if the expression is valid, doesn't bother if not
		if (Utils.isValidCase(expression, vars)) {

			// Gets the var values with bitwise operations 
			const combinations = Utils.allCombinations(vars.length)

			let table: string;

			// Replaces the JS style logic vars (i.e. &&, ||) with LaTeX symbols for typesetting
			if (this.settings.latex == true) {
				let latexExpression = ``

				for (let i = 0; i < expression.length; i++) {
					if (Utils.isLetter(expression.charAt(i)) || expression.charAt(i) == '(' || expression.charAt(i) == ')') {
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
				// Creates the header
				table = `| ${vars.join(' | ')} | ${latexExpression} |\n`
			} else {
				// If we aren't using LaTeX need to escape the pipes since they are also used to make a table
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

			// Adding divider to establish body
			table += `| ${'-|'.repeat(vars.length)}-|\n`

			// Gets each rows truth values
			for (let i = 0; i < combinations.length; i++) {
				const vals = []
				for (let j = 0; j < vars.length; j++) {
					vals.push(combinations[i][j])
				}
				try {
					// Evaluates the truth by row
					const truth = Utils.evaluateTruth(vals, expression, vars)

					// Converts booleans to binary
					if (this.settings.binary) {
						const numVals = []
						for (const x of vals) {
							numVals.push(Number(x))
						}
						table += `| ${numVals.join(' | ')} | ${Number(truth)} |\n`
					}
					// Makes truth values pretty in capital case
					else {
						const stringVals = []
						for (const x of vals) {
							stringVals.push(String(x).charAt(0).toUpperCase() + String(x).slice(1))
						}
						table += `| ${stringVals.join(' | ')} | ${String(truth).charAt(0).toUpperCase() + String(truth).slice(1)} |\n`
					}
				} catch (error) {
					new Notice('Something went wrong. \n Error: ' + error)
					return ''
				}
			}
			return table;
		} else {
			new Notice('Your logic expression was invalid. Please try again.', 5000)
			return ''
		}
	}
}

class SettingTab extends PluginSettingTab {
	plugin: TruthTablePlugin;

	constructor(app: App, plugin: TruthTablePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

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