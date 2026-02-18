export default class Utils {

    // You get it.
    public static isLetter(s: string): boolean {
        return s.toLowerCase() != s.toUpperCase()
    }

    public static isValidCase(exp: string, vars: string[]): boolean {
        // Removing whitespace and making all letters lowercase to normalize user input
        // Won't actually do anything in prod as input modal already removes all white space and converts to lowerCase
        // For testing
        exp = exp.replace(/\s+/g, '');
        exp = exp.toLowerCase()

        // Keeps track of validated indices
        const validatedIndices = new Map<number, boolean>()

        // Makes sure that each parentheses has a matching closure
        let openParen = 0
        let closeParen = 0

        // Checking for empty string
        if (exp.length == 0) return false

        // Iterating over normalized expression
        for (let i = 0; i < exp.length; i++) {
            // Checking that the last character isn't a symbol
            if (i == exp.length - 1 && (exp.charAt(i) == '&' || exp.charAt(i) == '!' || exp.charAt(i) == '|')) {
                return false;
            }
            // Increment respective counters if character is a parentheses
            else if (exp.charAt(i) == '(') {
                openParen++;

                // If char is an open parentheses check that there exists a closure after it
                let closure = false;
                for (let j = i; j < exp.length; j++) {
                    const char = exp.charAt(j)
                    if (char == ')') closure = true;
                }

                // If there is no closing parenthesis expression is invalid
                if (!closure) return false;

            } else if (exp.charAt(i) == ')') {
                closeParen++;
            }
            // If the index is not yet validated check it
            else if (validatedIndices.get(i) != true) {
                // Checking if the character is alphabetic and is in our established list of variables
                if (Utils.isLetter(exp.charAt(i)) && vars.includes(exp.charAt(i))) {
                    // Catching an out of bounds index
                    try {
                        // Ensure next character is not another variable
                        if (!Utils.isLetter(exp.charAt(i + 1))) {
                            validatedIndices.set(i, true);
                        } else return false
                    } catch (error) {
                        return false;
                    }
                // Checks if we are following a symbol immediatley after a symbol i.e. '&&||'
                } else if (exp.charAt(i) === "&" && (exp.charAt(i - 1) != '&' && exp.charAt(i - 1) != '|')) {
                    // Catching index out of bounds
                    try {
                        // Checking if we have two &s 
                        if ((exp.charAt(i + 1) === '&')) {
                            validatedIndices.set(i, true);
                            validatedIndices.set(i + 1, true)
                        } else return false
                    } catch (error) {
                        return false;
                    }
                // Check if we are following a symbol immediatley after another see above
                } else if (exp.charAt(i) === "|" && (exp.charAt(i - 1) != '&' && exp.charAt(i - 1) != '|')) {
                    // Catching index out of bounds
                    try {
                        // Checking if we haver two |s
                        if (exp.charAt(i + 1) === '|') {
                            validatedIndices.set(i, true);
                            validatedIndices.set(i + 1, true)
                        } else return false
                    } catch (error) {
                        return false;
                    }
                } else if (exp.charAt(i) === "!") {
                    // Catching index o.o.b.
                    try {
                        // Ensures that the negations is followed immediatley by a variable or open parenthesis
                        if (Utils.isLetter(exp.charAt(i + 1))) {
                            validatedIndices.set(i, true);
                            validatedIndices.set(i + 1, true)
                        } else if (exp.charAt(i + 1) == '(') {
                            validatedIndices.set(i, true)
                        } else return false
                    } catch (error) {
                        return false;
                    }
                } else { return false }
            }
        }
        // If we don't have the same number of open parentheses as closed the expression cannot be valid by definition
        if (openParen == closeParen) {
            return true;
        } else { return false }
    }

    
	public static evaluateTruth(vals: boolean[], expression: string, vars: string[]): boolean {
		let parsed = expression;
		for (let i = 0; i < vars.length; i++) {
			parsed = parsed.replace(new RegExp(`\\b${vars[i]}\\b`, 'g'), String(vals[i]));
		}
		return eval(parsed);
	}

    public static extractVars(e: string): string[] {
		const vars:string[] = []
        // Added to remove the need for users to add their own var list
		for (let i = 0; i < e.length; i++){
			const char = e.charAt(i)
			if(Utils.isLetter(char)){
				vars.push(char);
			}
		}
		return vars;
	}

    public static allCombinations(num: number): boolean[][] {
		const combinations = [];
        // Uses bitwise operations to increment 2^(num) bit number for the t/f values
		for (let i = 0; i < (1 << num); i++) {
			const combination = [];
			for (let j = num - 1; j >= 0; j--) {
				combination.push((i & (1 << j)) !== 0);
			}
			combinations.push(combination);
		}
		return combinations;
	}
}
