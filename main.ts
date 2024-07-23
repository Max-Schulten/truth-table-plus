import { Plugin, MarkdownView, Notice } from 'obsidian';
import { InputModal } from './InputModal';

export default class TruthTablePlugin extends Plugin {


  onload() {
    console.log('Loading TruthTablePlugin');

    // Add a command to generate a truth table
    this.addCommand({
      id: 'generate-truth-table',
      name: 'Generate Truth Table',
      callback: () => new InputModal(this.app, (exp, vars)=>this.createTruthTable(exp, vars)).open(),
    });
  }

  onunload() {
    console.log('Unloading TruthTablePlugin');
  }

  isLetter(s: string): boolean{
	return s.toLowerCase() != s.toUpperCase()
  }

  isValidCase(exp: string, vars: string[]): boolean{
	const validatedIndices = new Map<number, boolean>()

	for(let i = 0; i < exp.length; i++) {
		if(validatedIndices.get(i) != true) {
			if(this.isLetter(exp.charAt(i))) {
				try {
					if(!this.isLetter(exp.charAt(i+1))) {
						validatedIndices.set(i, true);
					}
				} catch (error) {
					return false;
				}
			} else if (exp.charAt(i) === "&") {
				try {
					if(exp.charAt(i+1) === '&') {
						validatedIndices.set(i, true);
						validatedIndices.set(i+1, true)
					}
				} catch (error) {
					return false;
				}
			} else if (exp.charAt(i) === "|") {
				try {
					if(exp.charAt(i+1) === '|') {
						validatedIndices.set(i, true);
						validatedIndices.set(i+1, true)
					}
				} catch (error) {
					return false;
				}
			} else if (exp.charAt(i) === "!") {
				try {
					if(this.isLetter(exp.charAt(i+1))) {
						validatedIndices.set(i, true);
						validatedIndices.set(i+1, true)
					}
				} catch (error) {
					return false;
				}
			} else { return false }
		}
	}
	return true;
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
      for (let j = 0; j < num; j++) {
        combination.push((i & (1 << j)) !== 0);
      }
      combinations.push(combination);
    }
    return combinations;
}

  evaluateTruth(vals: boolean[], expression: string, vars: string[]): boolean {
	
	let parsed = expression
	for(const char of expression){
		const i = vars.indexOf(char)
		console.log(i)
		if(i !== -1) {
			parsed = parsed.replace(char, String(vals[i]))
		}
	}
	
	return eval(parsed)
  }

  generateTruthTable(expression: string, vars: string[]): string {
	

	if (this.isValidCase(expression, vars)) {

	const combinations = this.allCombinations(vars.length)
	console.log(combinations);

	let table = `| ${vars.join(' | ')} | ${expression} |\n`;
	table += `| ${'-|'.repeat(vars.length)}-|\n`
	
	for (let i = 0; i < combinations.length; i++){
		const vals = []
		for (let j = 0; j < vars.length; j++) {
			vals.push(combinations[i][j])
		}
		try {
			const truth = this.evaluateTruth(vals, expression, vars)
			table += `| ${vals.join(' | ')} | ${truth} |\n`
		} catch (error) {
			new Notice('Something Went Wrong. \n Error Code: ' + error)
		}
	}


	console.log(table)
	


    return table;
	} else {
		new Notice('Your Logic Expression or Variables List was incorrect. Please try again.', 10000)
		return ''
	}
  }
  
}