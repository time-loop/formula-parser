import { CustomFieldVariable, FieldName, getCustomFieldRegex } from './customField';

export interface ValidationResult {
    hasCycle: boolean;
    isNestingTooDeep: boolean;
}

interface DependencyGraph {
    [fieldName: FieldName]: DependencyGraphNode;
}

interface DependencyGraphNode {
    dependents: FieldName[];
    dependencies: FieldName[];
}

interface ValidationContext {
    maxLevels: number;
    recStack: Set<FieldName>;
    depthByNode: Record<FieldName, number>;
}

interface DependentsLookupContext {
    visited: Set<FieldName>;
    result: FieldName[];
}

export class DependencyValidationError extends Error {
    constructor(message: string) {
        super(message);
    }
}

function createDependencyGraph(variables: CustomFieldVariable[]): DependencyGraph {
    const graph: DependencyGraph = {};
    return variables.reduce(addNodeToGraph, graph);
}

function addNodeToGraph(graph: DependencyGraph, v: CustomFieldVariable): DependencyGraph {
    const dependencies = extractDependencies(v);
    return dependencies.reduce(addDependencyToGraph(v.name), graph);
}

function extractDependencies(variable: CustomFieldVariable): FieldName[] {
    return hasDependencies(variable)
        ? Array.from(variable.value.matchAll(getCustomFieldRegex()), (m: FieldName[]) => m[0])
        : [];
}

function hasDependencies(v: CustomFieldVariable): boolean {
    return v.type === 'formula' && typeof v.value === 'string' && getCustomFieldRegex().test(v.value);
}

function addDependencyToGraph(fieldName: FieldName) {
    return (graph: DependencyGraph, dependency: FieldName) => {
        graph[dependency] = graph[dependency] || { dependents: [], dependencies: [] };
        graph[fieldName] = graph[fieldName] || { dependents: [], dependencies: [] };
        graph[dependency].dependents.push(fieldName);
        graph[fieldName].dependencies.push(dependency);
        return graph;
    };
}

export class ClickUpFieldsDependencyTracker {
    private variables: CustomFieldVariable[];
    private maxLevels: number;
    private graph: DependencyGraph;

    constructor(variables: CustomFieldVariable[], maxLevels: number = Number.MAX_SAFE_INTEGER) {
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
            recStack: new Set<FieldName>(),
            depthByNode: {},
        };

        const sameFieldInPath = (context: ValidationContext, fieldName: FieldName): boolean =>
            context.recStack.has(fieldName);

        function traverseNode(fieldName: FieldName, context: ValidationContext) {
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

    public getDependentFields(fieldName: FieldName): FieldName[] {
        const graph = this.getDependencyGraph();
        const getNeighbours = (name: FieldName) => graph[name]?.dependents || [];

        function traverseNode(graph: DependencyGraph, current: FieldName, context: DependentsLookupContext) {
            if (!context.visited.has(current)) {
                context.visited.add(current);
                const neighbours = getNeighbours(current);
                for (const neighbour of neighbours) {
                    traverseNode(graph, neighbour, context);
                }
                context.result.push(current);
            }
        }

        const visited = new Set<FieldName>();
        const result: FieldName[] = [];
        for (const neighbour of getNeighbours(fieldName)) {
            traverseNode(graph, neighbour, { visited, result });
        }

        return result.reverse();
    }
}
