import { CUSTOM_FIELD_REGEX, ClickUpParserVariable, VariableName } from './clickupParserVariable';

export interface ValidationResult {
    hasCycle: boolean;
    circularDependencies: VariableName[];
    nestingByNode: Record<VariableName, number>;
}

interface DependencyGraph {
    [fieldName: VariableName]: DependencyGraphNode;
}

interface DependencyGraphNode {
    dependents: VariableName[];
    dependencies: VariableName[];
}

interface ValidationContext {
    recStack: Set<VariableName>;
    depthByNode: Map<VariableName, number>;
    circularDeps: Set<VariableName>;
}

interface DependentsLookupContext {
    visited: Set<VariableName>;
    result: VariableName[];
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

function getDependents(graph: DependencyGraph, variableName: VariableName): VariableName[] {
    return graph[variableName]?.dependents || [];
}

function getDependencies(graph: DependencyGraph, variableName: VariableName): VariableName[] {
    return graph[variableName]?.dependencies || [];
}

function traverseNodeForPath(
    graph: DependencyGraph,
    variableName: VariableName,
    getNeighbours: (graph: DependencyGraph, name: VariableName) => VariableName[]
): VariableName[] {
    const visited = new Set<VariableName>();
    const result: VariableName[] = [];

    function traverseNodeInternal(graph: DependencyGraph, current: VariableName, context: DependentsLookupContext) {
        if (!context.visited.has(current)) {
            context.visited.add(current);
            const neighbours = getNeighbours(graph, current);
            for (const neighbour of neighbours) {
                traverseNodeInternal(graph, neighbour, context);
            }
            context.result.push(current);
        }
    }

    for (const neighbour of getNeighbours(graph, variableName)) {
        traverseNodeInternal(graph, neighbour, { visited, result });
    }

    return result;
}

export class ClickUpFieldsDependencyTracker {
    private variables: ClickUpParserVariable[];
    private formulaVariables: Set<VariableName>;
    private graph: DependencyGraph;

    constructor(variables: ClickUpParserVariable[]) {
        this.variables = variables;
        this.formulaVariables = new Set(variables.filter(isFormula).map((v) => v.name));
    }

    private getDependencyGraph(): DependencyGraph {
        if (!this.graph) {
            this.graph = createDependencyGraph(this.variables);
        }
        return this.graph;
    }

    public validate(): ValidationResult {
        const graph = this.getDependencyGraph();

        const sameVarInPath = (context: ValidationContext, variableName: VariableName): boolean =>
            context.recStack.has(variableName);

        const isFormulaVariable = (variableName: VariableName): boolean => this.formulaVariables.has(variableName);

        function traverseNodeForValidation(variableName: VariableName, context: ValidationContext): number {
            if (sameVarInPath(context, variableName)) {
                for (const varName of context.recStack) {
                    context.circularDeps.add(varName);
                }
                return 0;
            }

            if (context.depthByNode.has(variableName)) {
                return context.depthByNode.get(variableName) ?? 0; // should never happen, but TS can't infer that
            }

            context.recStack.add(variableName);

            let maxDepth = 0;
            for (const dependency of graph[variableName].dependencies) {
                const dependencyDepth = traverseNodeForValidation(dependency, context);
                // Only increment depth if the dependency is a formula
                maxDepth = Math.max(maxDepth, dependencyDepth + (isFormulaVariable(dependency) ? 1 : 0));
            }

            context.recStack.delete(variableName);
            context.depthByNode.set(variableName, maxDepth);

            return maxDepth;
        }

        const context: ValidationContext = {
            recStack: new Set<VariableName>(),
            depthByNode: new Map<VariableName, number>(),
            circularDeps: new Set<VariableName>(),
        };

        for (const varName in graph) {
            traverseNodeForValidation(varName, context);
        }

        return {
            hasCycle: context.circularDeps.size > 0,
            circularDependencies: Array.from(context.circularDeps),
            nestingByNode: Object.fromEntries(context.depthByNode),
        };
    }

    public getDependentFields(variableName: VariableName): VariableName[] {
        return traverseNodeForPath(this.getDependencyGraph(), variableName, getDependents).reverse();
    }

    public getFieldDependencies(variableName: VariableName): VariableName[] {
        return traverseNodeForPath(this.getDependencyGraph(), variableName, getDependencies);
    }
}
