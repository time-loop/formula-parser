import fs from 'fs';
import path from 'path';
import { CustomFieldVariable, FieldName } from '../../src/clickup/customField';

class CustomFieldsSet {
    private customFields: CustomFieldVariable[] = [];
    private functionCustomFields: CustomFieldVariable[] = [];
    private regularCustomFields: CustomFieldVariable[] = [];

    addCustomField(customField: CustomFieldVariable) {
        this.customFields.push(customField);
        if (customField.type === 'formula') {
            this.functionCustomFields.push(customField);
        } else {
            this.regularCustomFields.push(customField);
        }
    }

    getCustomFields(type?: string): CustomFieldVariable[] {
        switch (type) {
            case 'formula':
                return this.functionCustomFields;
            case 'regular':
                return this.regularCustomFields;
            default:
                return this.customFields;
        }
    }
}

function generateCustomFields(
    numFields: number,
    formulaRatio: number,
    dependenciesPerFormula: number,
    formulaDependencyRatio: number
): CustomFieldVariable[] {
    const fieldIds: FieldName[] = Array.from({ length: numFields }, (_, i) => `FIELD_${i}`);
    const customFields = new CustomFieldsSet();

    // Generate regular (non-formula) fields
    const numFormulas = Math.floor(numFields * formulaRatio);
    const numRegularFields = numFields - numFormulas;

    for (let i = 0; i < numRegularFields; i++) {
        customFields.addCustomField({
            name: fieldIds[i],
            type: 'regular',
            value: `Value for ${fieldIds[i]}`,
        });
    }

    // Generate formula fields
    for (let i = numFormulas; i < numFields; i++) {
        const dependencies = Array.from({ length: dependenciesPerFormula }, () => {
            const isFormulaDependency = Math.random() < formulaDependencyRatio;
            const dependencyType = isFormulaDependency && i !== numFormulas ? 'formula' : 'regular';
            const dependencyPool = customFields.getCustomFields(dependencyType);
            const randomDependency = dependencyPool[Math.floor(Math.random() * dependencyPool.length)];
            return randomDependency.name;
        });
        const formulaValue = dependencies.map((dep) => `CUSTOM_FIELD_${dep}`).join(' + ');

        customFields.addCustomField({
            name: fieldIds[i],
            type: 'formula',
            value: formulaValue,
        });
    }

    return customFields.getCustomFields();
}

function main() {
    const args = process.argv.slice(2);
    const numFields = parseInt(args[0]) || 1000;
    const formulaRatio = parseFloat(args[1]) || 0.5;
    const dependenciesPerFormula = parseInt(args[2]) || 10;
    const formulaDependencyRatio = parseFloat(args[3]) || 0.5;

    const customFields = generateCustomFields(numFields, formulaRatio, dependenciesPerFormula, formulaDependencyRatio);

    const outputFilePath = path.join(path.join(process.cwd(), 'test', 'data'), 'test_custom_fields.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(customFields, null, 4), 'utf-8');
    console.log(`Generated ${numFields} custom fields and saved to ${outputFilePath}`);
}

main();
