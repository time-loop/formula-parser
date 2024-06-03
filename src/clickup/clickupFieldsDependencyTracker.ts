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

type VariableNameMatch = {
    [index: number]: string;
};

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
        // return matches ? Array.from(matches, (match) => match[0]) : [];
        return matchesToVariableNames(matches);
    }
    return [];
}

function isFormula(v: ClickUpParserVariable): boolean {
    return v.type === 'formula' && typeof v.value === 'string';
}

function matchesToVariableNames(matches: IterableIterator<RegExpExecArray>): VariableName[] {
    const foundVariables = Array.from(matches, (match: VariableNameMatch) => match[0]);
    // ensure uniqueness
    return Array.from(new Set(foundVariables));
}

function addDependencyToGraph(fieldName: VariableName) {
    return (graph: DependencyGraph, dependency: VariableName) => {
        graph[dependency] = graph[dependency] || { dependents: [], dependencies: [] };
        graph[fieldName] = graph[fieldName] || { dependents: [], dependencies: [] };
        graph[dependency].dependents.push(fieldName);
        graph[fieldName].dependencies.push(dependency);
        return graph;
    };
}

export class ClickUpFieldsDependencyTracker {
    private variables: ClickUpParserVariable[];
    private maxLevels: number;
    private graph: DependencyGraph;

    constructor(variables: ClickUpParserVariable[], maxLevels: number = Number.MAX_SAFE_INTEGER) {
        this.variables = variables;
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

        const sameFieldInPath = (context: ValidationContext, fieldName: VariableName): boolean =>
            context.recStack.has(fieldName);

        function traverseNode(fieldName: VariableName, context: ValidationContext) {
            if (sameFieldInPath(context, fieldName)) {
                throw new DependencyValidationError('Circular dependency detected');
            }

            if (context.depthByNode[fieldName] !== undefined) {
                return context.depthByNode[fieldName];
            }

            context.recStack.add(fieldName);

            let maxDepth = 0;
            for (const dependency of graph[fieldName].dependencies) {
                maxDepth = Math.max(maxDepth, traverseNode(dependency, context) + 1);
                if (maxDepth > context.maxLevels) {
                    throw new DependencyValidationError(`Nesting is too deep at node: ${fieldName}`);
                }
            }

            context.recStack.delete(fieldName);
            context.depthByNode[fieldName] = maxDepth;

            return maxDepth;
        }

        for (const fieldName in graph) {
            traverseNode(fieldName, context);
        }
    }

    public getDependentFields(fieldName: VariableName): VariableName[] {
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
        for (const neighbour of getNeighbours(fieldName)) {
            traverseNode(graph, neighbour, { visited, result });
        }

        return result.reverse();
    }
}
