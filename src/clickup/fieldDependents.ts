import { CustomFieldVariable, FieldName, getCustomFieldRegex } from './customField';

interface ReverseDependencyGraph {
    [fieldName: FieldName]: Set<FieldName>;
}

export function createDependencyDetector(variables: CustomFieldVariable[]) {
    const graph = createReverseDependencyGraph(variables);
    return {
        getDependents: (fieldId: FieldName) => getDependents(graph, fieldId),
        hasCycle: () => Object.keys(graph).some(detectCycle(graph)),
    };
}

function createReverseDependencyGraph(variables: CustomFieldVariable[]): ReverseDependencyGraph {
    const reverseGraph: ReverseDependencyGraph = {};
    return variables.reduce(addNodeToGraph, reverseGraph);
}

function addNodeToGraph(graph: ReverseDependencyGraph, v: CustomFieldVariable): ReverseDependencyGraph {
    const dependencies = extractDependencies(v);
    return dependencies.reduce(addDependency(v.name), graph);
}

function extractDependencies(variable: CustomFieldVariable): FieldName[] {
    return hasDependencies(variable)
        ? Array.from(variable.value.matchAll(getCustomFieldRegex()), (m: FieldName[]) => m[0])
        : [];
}

function hasDependencies(v: CustomFieldVariable): boolean {
    return v.type === 'formula' && typeof v.value === 'string' && getCustomFieldRegex().test(v.value);
}

function addDependency(fieldName: FieldName) {
    return (graph: ReverseDependencyGraph, dependency: FieldName) => {
        if (!graph[dependency]) {
            graph[dependency] = new Set();
        }
        graph[dependency].add(fieldName);
        return graph;
    };
}

function detectCycle(
    graph: ReverseDependencyGraph,
    visited: Set<FieldName> = new Set(),
    recStack: Set<FieldName> = new Set()
) {
    return function (fieldName: FieldName): boolean {
        if (!visited.has(fieldName)) {
            visited.add(fieldName);
            recStack.add(fieldName);

            const neighbors = getDependents(graph, fieldName);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor) && detectCycle(graph, visited, recStack)(neighbor)) {
                    return true;
                } else if (recStack.has(neighbor)) {
                    return true;
                }
            }
        }
        recStack.delete(fieldName);
        return false;
    };
}

function getDependents(reverseGraph: ReverseDependencyGraph, fieldName: FieldName): FieldName[] {
    const dependencies = reverseGraph[fieldName];
    return dependencies ? Array.from(dependencies) : [];
}

export function haveSameDependencies(a: CustomFieldVariable, b: CustomFieldVariable): boolean {
    const aDeps = extractDependencies(a);
    const bDeps = extractDependencies(b);
    return arraysEqual(aDeps, bDeps);
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const countMap = {};

    // Count elements in the first array
    for (const el of arr1) {
        countMap[el] = (countMap[el] || 0) + 1;
    }

    // Subtract count for elements in the second array
    for (const el of arr2) {
        if (!countMap[el]) {
            return false;
        }
        countMap[el]--;
    }
    const hasNonZeroCount = (countMap) => (key) => countMap[key] !== 0;
    const not = (v: boolean) => !v;
    return not(Object.keys(countMap).some(hasNonZeroCount(countMap)));
}
