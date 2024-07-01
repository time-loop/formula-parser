import { CUSTOM_FIELD_REGEX, ClickUpParserVariable, VariableName } from './clickupParserVariable';

export interface ValidationResult {
    hasCycle: boolean;
    isNestingTooDeep: boolean;
}

interface DependencyGraph {
    [fieldName: VariableName]: DependencyGraphNode;
}

interface DependencyGraphNode {
    dependents: VariableName[];
    dependencies: VariableName[];
}

interface ValidationContext {
    maxLevels: number;
    recStack: Set<VariableName>;
    depthByNode: Record<VariableName, number>;
}

interface DependentsLookupContext {
    visited: Set<VariableName>;
    result: VariableName[];
}

export class DependencyValidationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

function createDependencyGraph(variables: ClickUpParserVariable[]): DependencyGraph {
    const graph: DependencyGraph = {};
    return variables.reduce(addNodeToGraph, graph);
}

function addNodeToGraph(graph: DependencyGraph, v: ClickUpParserVariable) {
    const dependencies = extractDependencies(v);
    return dependencies.reduce(addDependencyToGraph(v.name), graph);
}

function extractDependencies(variable: ClickUpParserVariable): VariableName[] {
    if (isFormula(variable)) {
        const matches = (variable.value as string).matchAll(CUSTOM_FIELD_REGEX);
        return matchesToVariableNames(matches);
    }
    return [];
}

function isFormula(v: ClickUpParserVariable): boolean {
    return v.isFormula === true && typeof v.value === 'string';
}

function matchesToVariableNames(matches: IterableIterator<RegExpExecArray>): VariableName[] {
    const foundVariables = Array.from(matches, (match) => match[0]);
    // ensure uniqueness
    return Array.from(new Set(foundVariables));
}

function addDependencyToGraph(variableName: VariableName) {
    return (graph: DependencyGraph, dependency: VariableName) => {
        graph[dependency] = graph[dependency] || { dependents: [], dependencies: [] };
        graph[variableName] = graph[variableName] || { dependents: [], dependencies: [] };
        graph[dependency].dependents.push(variableName);
        graph[variableName].dependencies.push(dependency);
        return graph;
    };
}

export class ClickUpFieldsDependencyTracker {
    private variables: ClickUpParserVariable[];
    private formulaVariables: Set<VariableName>;
    private maxLevels: number;
    private graph: DependencyGraph;

    constructor(variables: ClickUpParserVariable[], maxLevels: number = Number.MAX_SAFE_INTEGER) {
        this.variables = variables;
        this.formulaVariables = new Set(variables.filter(isFormula).map((v) => v.name));
        this.maxLevels = maxLevels;
    }

    private getDependencyGraph(): DependencyGraph {
        if (!this.graph) {
            this.graph = createDependencyGraph(this.variables);
        }
        return this.graph;
    }

    public validate() {
        const graph = this.getDependencyGraph();

        const context: ValidationContext = {
            maxLevels: this.maxLevels,
            recStack: new Set<VariableName>(),
            depthByNode: {},
        };

        const sameVarInPath = (context: ValidationContext, variableName: VariableName): boolean =>
            context.recStack.has(variableName);

        const isFormulaVariable = (variableName: VariableName): boolean => this.formulaVariables.has(variableName);

        function traverseNode(variableName: VariableName, context: ValidationContext) {
            if (sameVarInPath(context, variableName)) {
                throw new DependencyValidationError('Circular dependency detected');
            }

            if (context.depthByNode[variableName] !== undefined) {
                return context.depthByNode[variableName];
            }

            context.recStack.add(variableName);

            let maxDepth = 0;
            for (const dependency of graph[variableName].dependencies) {
                const dependencyDepth = traverseNode(dependency, context);
                // Only increment depth if the dependency is a formula
                maxDepth = Math.max(maxDepth, dependencyDepth + (isFormulaVariable(dependency) ? 1 : 0));
                if (maxDepth > context.maxLevels) {
                    throw new DependencyValidationError(`Nesting is too deep at node: ${variableName}`);
                }
            }

            context.recStack.delete(variableName);
            context.depthByNode[variableName] = maxDepth;

            return maxDepth;
        }

        for (const varName in graph) {
            traverseNode(varName, context);
        }
    }

    public getDependentFields(variableName: VariableName): VariableName[] {
        const graph = this.getDependencyGraph();
        const getNeighbours = (name: VariableName) => graph[name]?.dependents || [];

        function traverseNode(graph: DependencyGraph, current: VariableName, context: DependentsLookupContext) {
            if (!context.visited.has(current)) {
                context.visited.add(current);
                const neighbours = getNeighbours(current);
                for (const neighbour of neighbours) {
                    traverseNode(graph, neighbour, context);
                }
                context.result.push(current);
            }
        }

        const visited = new Set<VariableName>();
        const result: VariableName[] = [];
        for (const neighbour of getNeighbours(variableName)) {
            traverseNode(graph, neighbour, { visited, result });
        }

        return result.reverse();
    }
}
