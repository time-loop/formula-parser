import fs from 'fs';
import path from 'path';
import { ClickUpParserVariable, VariableName } from '../../src/clickup/clickupParserVariable';

class VariablesSet {
    private variables: ClickUpParserVariable[] = [];
    private functionVariables: ClickUpParserVariable[] = [];
    private regularVariables: ClickUpParserVariable[] = [];

    addVariable(variable: ClickUpParserVariable) {
        this.variables.push(variable);
        if (variable.type === 'formula') {
            this.functionVariables.push(variable);
        } else {
            this.regularVariables.push(variable);
        }
    }

    getVariables(type?: string): ClickUpParserVariable[] {
        switch (type) {
            case 'formula':
                return this.functionVariables;
            case 'regular':
                return this.regularVariables;
            default:
                return this.variables;
        }
    }
}

function generateCustomFields(
    numFields: number,
    formulaRatio: number,
    dependenciesPerFormula: number,
    formulaDependencyRatio: number
): ClickUpParserVariable[] {
    const makeVariableName = (id: number) => `CUSTOM_FIELD_${id}`;
    const variableIds: VariableName[] = Array.from({ length: numFields }, (_, i) => makeVariableName(i));
    const variables = new VariablesSet();

    // Generate regular (non-formula) fields
    const numFormulas = Math.floor(numFields * formulaRatio);
    const numRegularVars = numFields - numFormulas;

    for (let i = 0; i < numRegularVars; i++) {
        variables.addVariable({
            name: variableIds[i],
            type: 'regular',
            value: `Value for ${variableIds[i]}`,
        });
    }

    // Generate formula fields
    for (let i = numRegularVars; i < numFields; i++) {
        const dependencies = Array.from({ length: dependenciesPerFormula }, () => {
            const isFormulaDependency = Math.random() < formulaDependencyRatio;
            const dependencyType = isFormulaDependency && i !== numRegularVars ? 'formula' : 'regular';
            const dependencyPool = variables.getVariables(dependencyType);
            const randomDependency = dependencyPool[Math.floor(Math.random() * dependencyPool.length)];
            return randomDependency.name;
        });
        const formulaValue = dependencies.join(' + ');

        variables.addVariable({
            name: variableIds[i],
            type: 'formula',
            value: formulaValue,
        });
    }

    return variables.getVariables();
}

function main() {
    const args = process.argv.slice(2);
    const numFields = parseInt(args[0]) || 30000;
    const formulaRatio = parseFloat(args[1]) || 0.5;
    const dependenciesPerFormula = parseInt(args[2]) || 10;
    const formulaDependencyRatio = parseFloat(args[3]) || 0.5;

    const customFields = generateCustomFields(numFields, formulaRatio, dependenciesPerFormula, formulaDependencyRatio);

    const outputFilePath = path.join(path.join(process.cwd(), 'test', 'data'), 'test_custom_fields.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(customFields, null, 4), 'utf-8');
    console.log(`Generated ${numFields} custom fields and saved to ${outputFilePath}`);
}

main();
