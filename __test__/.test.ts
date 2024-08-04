import Utils from '../utils';

// One big test file for all funcs.

describe('Utils class', () => {
    describe('isLetter function', () => {
        it('Should return true for lowercase alphabetic character "a"', () => {
            expect(Utils.isLetter('a')).toBe(true);
        });

        it('Should return true for uppercase alphabetic character "Z"', () => {
            expect(Utils.isLetter('Z')).toBe(true);
        });

        it('Should return true for lowercase alphabetic character "m"', () => {
            expect(Utils.isLetter('m')).toBe(true);
        });

        it('Should return true for uppercase alphabetic character "M"', () => {
            expect(Utils.isLetter('M')).toBe(true);
        });

        it('Should return true for lowercase alphabetic character "x"', () => {
            expect(Utils.isLetter('x')).toBe(true);
        });

        it('Should return true for uppercase alphabetic character "X"', () => {
            expect(Utils.isLetter('X')).toBe(true);
        });

        it('Should return false for numeric character "1"', () => {
            expect(Utils.isLetter('1')).toBe(false);
        });

        it('Should return false for numeric character "9"', () => {
            expect(Utils.isLetter('9')).toBe(false);
        });

        it('Should return false for special character "!"', () => {
            expect(Utils.isLetter('!')).toBe(false);
        });

        it('Should return false for special character "@"', () => {
            expect(Utils.isLetter('@')).toBe(false);
        });

        it('Should return false for special character "#"', () => {
            expect(Utils.isLetter('#')).toBe(false);
        });

        it('Should return false for special character "$"', () => {
            expect(Utils.isLetter('$')).toBe(false);
        });

        it('Should return false for special character "%"', () => {
            expect(Utils.isLetter('%')).toBe(false);
        });

        it('Should return false for special character "&"', () => {
            expect(Utils.isLetter('&')).toBe(false);
        });

        it('Should return false for empty string', () => {
            expect(Utils.isLetter('')).toBe(false);
        });

        it('Should return false for space character', () => {
            expect(Utils.isLetter(' ')).toBe(false);
        });

        it('Should return true for accented alphabetic character "é"', () => {
            expect(Utils.isLetter('é')).toBe(true);
        });

        it('Should return true for non-Latin alphabetic character "Ж"', () => {
            expect(Utils.isLetter('Ж')).toBe(true);
        });

        it('Should return false for emoji character "😊"', () => {
            expect(Utils.isLetter('😊')).toBe(false);
        });

        it('Should return true for alphabetic character with diacritic "ñ"', () => {
            expect(Utils.isLetter('ñ')).toBe(true);
        });

        it('Should return false for null character', () => {
            expect(Utils.isLetter('\0')).toBe(false);
        });
    });

    describe('isValidCase function', () => {
        it('Should return true for valid expression "a && b"', () => {
            expect(Utils.isValidCase('a && b', ['a', 'b'])).toBe(true);
        });

        it('Should return true for valid expression "!a"', () => {
            expect(Utils.isValidCase('!a', ['a'])).toBe(true);
        });

        it('Should return false for invalid expression ")a&&b("', () => {
            expect(Utils.isValidCase(')a&&b(', ['a', 'b'])).toBe(false);
        });

        it('Should return false for invalid expression "a &&"', () => {
            expect(Utils.isValidCase('a &&', ['a'])).toBe(false);
        });

        it('Should return true for valid expression with parentheses "(a && b) || c"', () => {
            expect(Utils.isValidCase('(a && b) || c', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should return false for unmatched parentheses "(a && b || c"', () => {
            expect(Utils.isValidCase('(a && b || c', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should return false for expression with invalid character "a && 1"', () => {
            expect(Utils.isValidCase('a && 1', ['a'])).toBe(false);
        });

        it('Should return true for valid negation expression "!a && b"', () => {
            expect(Utils.isValidCase('!a && b', ['a', 'b'])).toBe(true);
        });

        it('Should return false for invalid negation expression "!a &&"', () => {
            expect(Utils.isValidCase('!a &&', ['a'])).toBe(false);
        });

        it('Should return true for complex valid expression "a && (b || c) && !d"', () => {
            expect(Utils.isValidCase('a && (b || c) && !d', ['a', 'b', 'c', 'd'])).toBe(true);
        });

        it('Should return false for expression with extra closing parenthesis "a && b)"', () => {
            expect(Utils.isValidCase('a && b)', ['a', 'b'])).toBe(false);
        });

        it('Should return true for expression with mixed operators "a || b && c"', () => {
            expect(Utils.isValidCase('a || b && c', ['a', 'b', 'c'])).toBe(true);
        });

        // Additional test cases
        it('Should return true for valid expression with nested parentheses "(a && (b || c)) && d"', () => {
            expect(Utils.isValidCase('(a && (b || c)) && d', ['a', 'b', 'c', 'd'])).toBe(true);
        });

        it('Should return false for expression with invalid variable "a && e"', () => {
            expect(Utils.isValidCase('a && e', ['a', 'b'])).toBe(false);
        });

        it('Should return false for expression with misplaced negation "a && ! && b"', () => {
            expect(Utils.isValidCase('a && ! && b', ['a', 'b'])).toBe(false);
        });

        it('Should return true for valid expression with multiple negations "!a && !b"', () => {
            expect(Utils.isValidCase('!a && !b', ['a', 'b'])).toBe(true);
        });

        it('Should return false for expression with misplaced ampersand "a & b"', () => {
            expect(Utils.isValidCase('a & b', ['a', 'b'])).toBe(false);
        });

        it('Should return true for valid expression with variable reuse "a && (a || b)"', () => {
            expect(Utils.isValidCase('a && (a || b)', ['a', 'b'])).toBe(true);
        });

        it('Should return false for expression with invalid character "a && *"', () => {
            expect(Utils.isValidCase('a && *', ['a'])).toBe(false);
        });

        it('Should return true for valid expression with spaces "a && b || c"', () => {
            expect(Utils.isValidCase('a && b || c', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should return false for empty expression', () => {
            expect(Utils.isValidCase('', [])).toBe(false);
        });

        it('Should return false for expression with only operators "&& ||"', () => {
            expect(Utils.isValidCase('&& ||', [])).toBe(false);
        });

        it('Should return false for expression with operators only', () => {
            expect(Utils.isValidCase('&& || &&', [])).toBe(false);
        });

        it('Should return true for valid expression with complex nested parentheses "((a && b) || (c && d)) && e"', () => {
            expect(Utils.isValidCase('((a && b) || (c && d)) && e', ['a', 'b', 'c', 'd', 'e'])).toBe(true);
        });

        it('Should return false for expression with multiple invalid characters "a && b @ c"', () => {
            expect(Utils.isValidCase('a && b @ c', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should return false for expression with consecutive invalid operators "a && || b"', () => {
            expect(Utils.isValidCase('a && || b', ['a', 'b'])).toBe(false);
        });

        it('Should return true for valid expression with mixed negations "a && !b || c"', () => {
            expect(Utils.isValidCase('a && !b || c', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should return false for expression with invalid negation placement "!a && b!"', () => {
            expect(Utils.isValidCase('!a && b!', ['a', 'b'])).toBe(false);
        });

        it('Should return true for valid expression with nested negations "!(a || !b) && c"', () => {
            expect(Utils.isValidCase('!(a || !b) && c', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should return false for expression with invalid parentheses "a && (b || c"', () => {
            expect(Utils.isValidCase('a && (b || c', ['a', 'b', 'c'])).toBe(false);
        });
    });


    describe('evaluateTruth function', () => {
        it('Should evaluate simple expression "a" with value true', () => {
            expect(Utils.evaluateTruth([true], 'a', ['a'])).toBe(true);
        });

        it('Should evaluate simple expression "a" with value false', () => {
            expect(Utils.evaluateTruth([false], 'a', ['a'])).toBe(false);
        });

        it('Should evaluate expression "a && b" with values true and true', () => {
            expect(Utils.evaluateTruth([true, true], 'a && b', ['a', 'b'])).toBe(true);
        });

        it('Should evaluate expression "a && b" with values true and false', () => {
            expect(Utils.evaluateTruth([true, false], 'a && b', ['a', 'b'])).toBe(false);
        });

        it('Should evaluate expression "a || b" with values true and false', () => {
            expect(Utils.evaluateTruth([true, false], 'a || b', ['a', 'b'])).toBe(true);
        });

        it('Should evaluate expression "a || b" with values false and false', () => {
            expect(Utils.evaluateTruth([false, false], 'a || b', ['a', 'b'])).toBe(false);
        });

        it('Should evaluate expression "!a" with value true', () => {
            expect(Utils.evaluateTruth([true], '!a', ['a'])).toBe(false);
        });

        it('Should evaluate expression "!a" with value false', () => {
            expect(Utils.evaluateTruth([false], '!a', ['a'])).toBe(true);
        });

        it('Should evaluate expression "(a && b) || c" with values true, false, true', () => {
            expect(Utils.evaluateTruth([true, false, true], '(a && b) || c', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should evaluate expression "(a && b) || c" with values true, false, false', () => {
            expect(Utils.evaluateTruth([true, false, false], '(a && b) || c', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should evaluate expression "a && (b || c)" with values true, false, true', () => {
            expect(Utils.evaluateTruth([true, false, true], 'a && (b || c)', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should evaluate expression "a && (b || c)" with values true, false, false', () => {
            expect(Utils.evaluateTruth([true, false, false], 'a && (b || c)', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should evaluate expression "a || (b && c)" with values false, true, false', () => {
            expect(Utils.evaluateTruth([false, true, false], 'a || (b && c)', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should evaluate expression "a || (b && c)" with values false, true, true', () => {
            expect(Utils.evaluateTruth([false, true, true], 'a || (b && c)', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should evaluate expression "!(a && b) || c" with values true, false, true', () => {
            expect(Utils.evaluateTruth([true, false, true], '!(a && b) || c', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should evaluate expression "!(a && b) || c" with values true, true, false', () => {
            expect(Utils.evaluateTruth([true, true, false], '!(a && b) || c', ['a', 'b', 'c'])).toBe(false);
        });

        // Additional test cases
        it('Should evaluate expression "a && !b" with values true, false', () => {
            expect(Utils.evaluateTruth([true, false], 'a && !b', ['a', 'b'])).toBe(true);
        });

        it('Should evaluate expression "a && !b" with values true, true', () => {
            expect(Utils.evaluateTruth([true, true], 'a && !b', ['a', 'b'])).toBe(false);
        });

        it('Should evaluate expression "a || !b" with values false, false', () => {
            expect(Utils.evaluateTruth([false, false], 'a || !b', ['a', 'b'])).toBe(true);
        });

        it('Should evaluate expression "a || !b" with values false, true', () => {
            expect(Utils.evaluateTruth([false, true], 'a || !b', ['a', 'b'])).toBe(false);
        });

        it('Should evaluate expression "!(a || b) && c" with values false, false, true', () => {
            expect(Utils.evaluateTruth([false, false, true], '!(a || b) && c', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should evaluate expression "!(a || b) && c" with values true, false, true', () => {
            expect(Utils.evaluateTruth([true, false, true], '!(a || b) && c', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should evaluate expression "a && (b && c)" with values true, true, true', () => {
            expect(Utils.evaluateTruth([true, true, true], 'a && (b && c)', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should evaluate expression "a && (b && c)" with values true, true, false', () => {
            expect(Utils.evaluateTruth([true, true, false], 'a && (b && c)', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should evaluate expression "a || (b || c)" with values false, false, false', () => {
            expect(Utils.evaluateTruth([false, false, false], 'a || (b || c)', ['a', 'b', 'c'])).toBe(false);
        });

        it('Should evaluate expression "a || (b || c)" with values false, true, false', () => {
            expect(Utils.evaluateTruth([false, true, false], 'a || (b || c)', ['a', 'b', 'c'])).toBe(true);
        });

        it('Should evaluate expression "a && (b || (c && d))" with values true, false, true, true', () => {
            expect(Utils.evaluateTruth([true, false, true, true], 'a && (b || (c && d))', ['a', 'b', 'c', 'd'])).toBe(true);
        });

        it('Should evaluate expression "a && (b || (c && d))" with values true, false, true, false', () => {
            expect(Utils.evaluateTruth([true, false, true, false], 'a && (b || (c && d))', ['a', 'b', 'c', 'd'])).toBe(false);
        });

        it('Should evaluate expression "a || (b && (!c || d))" with values false, true, false, true', () => {
            expect(Utils.evaluateTruth([false, true, false, true], 'a || (b && (!c || d))', ['a', 'b', 'c', 'd'])).toBe(true);
        });

        it('Should evaluate expression "a || (b && (!c || d))" with values false, true, true, false', () => {
            expect(Utils.evaluateTruth([false, true, true, false], 'a || (b && (!c || d))', ['a', 'b', 'c', 'd'])).toBe(false);
        });
    });

    describe('extractVars function', () => {
        it('Should extract variables from a simple expression "a && b"', () => {
            expect(Utils.extractVars('a && b')).toEqual(['a', 'b']);
        });

        it('Should extract variables from an expression with negation "!a && b"', () => {
            expect(Utils.extractVars('!a && b')).toEqual(['a', 'b']);
        });

        it('Should extract variables from an expression with parentheses "(a && b) || c"', () => {
            expect(Utils.extractVars('(a && b) || c')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an expression with repeated variables "a && a || b"', () => {
            expect(Utils.extractVars('a && a || b')).toEqual(['a', 'a', 'b']);
        });

        it('Should extract variables from an expression with mixed operators "a || b && c"', () => {
            expect(Utils.extractVars('a || b && c')).toEqual(['a', 'b', 'c']);
        });

        it('Should return an empty array for an expression with no variables "&& ||"', () => {
            expect(Utils.extractVars('&& ||')).toEqual([]);
        });

        it('Should extract variables from an expression with accented characters "é && b"', () => {
            expect(Utils.extractVars('é && b')).toEqual(['é', 'b']);
        });

        it('Should extract variables from an expression with non-Latin characters "Ж && b"', () => {
            expect(Utils.extractVars('Ж && b')).toEqual(['Ж', 'b']);
        });

        it('Should extract variables from a complex expression with nested parentheses "a && (b || (c && d))"', () => {
            expect(Utils.extractVars('a && (b || (c && d))')).toEqual(['a', 'b', 'c', 'd']);
        });

        it('Should extract variables from an expression with multiple negations "!a && !b"', () => {
            expect(Utils.extractVars('!a && !b')).toEqual(['a', 'b']);
        });

        it('Should extract variables from an expression with spaces "a && b || c"', () => {
            expect(Utils.extractVars('a && b || c')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an expression with special characters "a && b @ c"', () => {
            expect(Utils.extractVars('a && b @ c')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an empty expression', () => {
            expect(Utils.extractVars('')).toEqual([]);
        });

        it('Should extract variables from an expression with a single variable "a"', () => {
            expect(Utils.extractVars('a')).toEqual(['a']);
        });

        it('Should extract variables from an expression with multiple variables without operators "abc"', () => {
            expect(Utils.extractVars('abc')).toEqual(['a', 'b', 'c']);
        });

        // Additional test cases
        it('Should extract variables from an expression with mixed alphanumeric characters "a1 && b2 || c3"', () => {
            expect(Utils.extractVars('a1 && b2 || c3')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an expression with mixed letters and numbers "a123 && b456 || c789"', () => {
            expect(Utils.extractVars('a123 && b456 || c789')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an expression with underscores "a_b && c_d"', () => {
            expect(Utils.extractVars('a_b && c_d')).toEqual(['a', 'b', 'c', 'd']);
        });

        it('Should extract variables from an expression with hyphens "a-b && c-d"', () => {
            expect(Utils.extractVars('a-b && c-d')).toEqual(['a', 'b', 'c', 'd']);
        });

        it('Should extract variables from an expression with dots "a.b && c.d"', () => {
            expect(Utils.extractVars('a.b && c.d')).toEqual(['a', 'b', 'c', 'd']);
        });

        it('Should extract variables from an expression with multiple operators "a && b || c && d"', () => {
            expect(Utils.extractVars('a && b || c && d')).toEqual(['a', 'b', 'c', 'd']);
        });

        it('Should extract variables from an expression with negations and operators "!a && !b || c"', () => {
            expect(Utils.extractVars('!a && !b || c')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an expression with only variables "abcdef"', () => {
            expect(Utils.extractVars('abcdef')).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });

        it('Should extract variables from an expression with variables and multiple spaces "a && b || c"', () => {
            expect(Utils.extractVars('a && b || c')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an expression with variables and special characters "a! && b@ || c#"', () => {
            expect(Utils.extractVars('a! && b@ || c#')).toEqual(['a', 'b', 'c']);
        });

        it('Should extract variables from an expression with mixed uppercase and lowercase letters "A && b || C && d"', () => {
            expect(Utils.extractVars('A && b || C && d')).toEqual(['A', 'b', 'C', 'd']);
        });

        it('Should extract variables from an expression with mixed uppercase and lowercase letters without operators "AbCdEf"', () => {
            expect(Utils.extractVars('AbCdEf')).toEqual(['A', 'b', 'C', 'd', 'E', 'f']);
        });

        it('Should extract variables from an expression with nested parentheses and mixed operators "(a && (b || (c && d))) || e"', () => {
            expect(Utils.extractVars('(a && (b || (c && d))) || e')).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
    });
    describe('allCombinations function', () => {
        it('Should return all combinations for 0 variables', () => {
            expect(Utils.allCombinations(0)).toEqual([[]]);
        });

        it('Should return all combinations for 1 variable', () => {
            expect(Utils.allCombinations(1)).toEqual([
                [false],
                [true]
            ]);
        });

        it('Should return all combinations for 2 variables', () => {
            expect(Utils.allCombinations(2)).toEqual([
                [false, false],
                [false, true],
                [true, false],
                [true, true]
            ]);
        });

        it('Should return all combinations for 3 variables', () => {
            expect(Utils.allCombinations(3)).toEqual([
                [false, false, false],
                [false, false, true],
                [false, true, false],
                [false, true, true],
                [true, false, false],
                [true, false, true],
                [true, true, false],
                [true, true, true]
            ]);
        });

        it('Should return all combinations for 4 variables', () => {
            expect(Utils.allCombinations(4)).toEqual([
                [false, false, false, false],
                [false, false, false, true],
                [false, false, true, false],
                [false, false, true, true],
                [false, true, false, false],
                [false, true, false, true],
                [false, true, true, false],
                [false, true, true, true],
                [true, false, false, false],
                [true, false, false, true],
                [true, false, true, false],
                [true, false, true, true],
                [true, true, false, false],
                [true, true, false, true],
                [true, true, true, false],
                [true, true, true, true]
            ]);
        });
    });
});
